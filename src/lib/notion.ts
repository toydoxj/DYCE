import { Client } from "@notionhq/client";
import { unstable_cache } from "next/cache";
import type {
  PageObjectResponse,
  DatabaseObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Project, FilterOptions } from "@/types";
import {
  getAllProjectsCached,
  getFilterOptionsCached,
  filterProjects,
} from "./notion-cache";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID ?? "";

// Notion 속성 이름 상수 (MasterProject DB 기준)
const PROP = {
  PROJECT_NAME: "용역명",
  MASTER_CODE: "MASTER_CODE",
  USAGE: "용도",
  STRUCTURE_TYPE: "구조형식",
  HEIGHT: "높이",
  TOTAL_FLOOR_AREA: "연면적",
  ABOVE_GROUND_FLOORS: "지상층수",
  UNDERGROUND_FLOORS: "지하층수",
  BUILDING_COUNT: "동수",
  ADDRESS: "주소",
  WORK_SCOPE: "업무내용",
  STATUS: "진행단계",
  CONTRACT_DATE: "계약일",
} as const;

// API 키가 설정되지 않은 경우 빈 결과 반환
function isConfigured(): boolean {
  return !!(process.env.NOTION_API_KEY && process.env.NOTION_API_KEY !== "secret_xxxxx");
}

// PageObjectResponse의 속성 타입
type PageProperties = PageObjectResponse["properties"];
type PropertyValue = PageProperties[string];

// Notion 속성에서 텍스트 값 추출 (속성이 없을 때 안전하게 처리)
function getTitle(property: PropertyValue | undefined): string {
  if (!property) return "";
  if (property.type === "title" && property.title.length > 0) {
    return property.title.map((t) => t.plain_text).join("");
  }
  return "";
}

function getRichText(property: PropertyValue | undefined): string {
  if (!property) return "";
  if (property.type === "rich_text" && property.rich_text.length > 0) {
    return property.rich_text.map((t) => t.plain_text).join("");
  }
  return "";
}

function getNumber(property: PropertyValue | undefined): number | null {
  if (!property) return null;
  if (property.type === "number") {
    return property.number;
  }
  return null;
}

function getMultiSelect(property: PropertyValue | undefined): string[] {
  if (!property) return [];
  if (property.type === "multi_select") {
    return property.multi_select.map((s) => s.name);
  }
  return [];
}

function getRollupMultiSelect(property: PropertyValue | undefined): string[] {
  if (!property) return [];
  if (property.type === "rollup" && property.rollup.type === "array") {
    const names = new Set<string>();
    for (const item of property.rollup.array) {
      if (item.type === "multi_select") {
        for (const s of item.multi_select) {
          names.add(s.name);
        }
      }
    }
    return [...names];
  }
  // multi_select 타입도 지원 (DB에 따라 rollup 또는 multi_select일 수 있음)
  if (property.type === "multi_select") {
    return property.multi_select.map((s) => s.name);
  }
  return [];
}

function getSelect(property: PropertyValue | undefined): string {
  if (!property) return "";
  if (property.type === "select" && property.select) {
    return property.select.name;
  }
  return "";
}

function getDate(property: PropertyValue | undefined): string | null {
  if (!property) return null;
  if (property.type === "date" && property.date) {
    return property.date.start;
  }
  return null;
}

// 페이지에 커버 이미지가 있는지 확인
function hasCoverImage(page: PageObjectResponse): boolean {
  return page.cover !== null;
}

// Notion 페이지를 Project 타입으로 변환
// coverImage에는 프록시 URL을 저장 (Notion 임시 URL 만료 방지)
function pageToProject(page: PageObjectResponse, hasCover: boolean): Project {
  const coverImage = hasCover ? `/api/notion-image/cover/${page.id}` : null;
  const p = page.properties;

  return {
    id: page.id,
    projectName: getTitle(p[PROP.PROJECT_NAME]),
    code: getRichText(p[PROP.MASTER_CODE]),
    usage: getMultiSelect(p[PROP.USAGE]),
    structureType: getMultiSelect(p[PROP.STRUCTURE_TYPE]),
    height: getNumber(p[PROP.HEIGHT]),
    totalFloorArea: getNumber(p[PROP.TOTAL_FLOOR_AREA]),
    aboveGroundFloors: getNumber(p[PROP.ABOVE_GROUND_FLOORS]),
    undergroundFloors: getNumber(p[PROP.UNDERGROUND_FLOORS]),
    buildingCount: getNumber(p[PROP.BUILDING_COUNT]),
    address: getRichText(p[PROP.ADDRESS]),
    workScope: getRollupMultiSelect(p[PROP.WORK_SCOPE]),
    status: getSelect(p[PROP.STATUS]),
    contractDate: getDate(p[PROP.CONTRACT_DATE]),
    coverImage,
  };
}

// ─── Notion에서 직접 조회하는 함수 (notion-cache.ts, revalidate API에서 사용) ───

// 전체 프로젝트 목록 (필터 없이 전량 조회)
export async function fetchAllProjects(): Promise<Project[]> {
  if (!isConfigured()) return [];

  try {
    const allResults: Project[] = [];
    let hasMore = true;
    let startCursor: string | undefined;

    while (hasMore) {
      const response = await notion.databases.query({
        database_id: DATABASE_ID,
        page_size: 100,
        sorts: [{ timestamp: "created_time", direction: "descending" }],
        start_cursor: startCursor,
      } as Parameters<typeof notion.databases.query>[0]);

      const pages = response.results.filter(
        (page): page is PageObjectResponse => "properties" in page
      );

      // 커버 유무만 확인하고 프록시 URL 생성 (Notion 임시 URL 캐싱 방지)
      const projects = pages.map((page) => {
        return pageToProject(page, hasCoverImage(page));
      });
      allResults.push(...projects);

      hasMore = response.has_more;
      startCursor = response.next_cursor ?? undefined;
    }

    return allResults;
  } catch (error) {
    console.error("Notion API 프로젝트 조회 실패:", error);
    return [];
  }
}

// 필터 옵션 추출 (DB 스키마 조회)
export async function fetchFilterOptions(): Promise<FilterOptions> {
  if (!isConfigured()) return { usages: [], structureTypes: [], statuses: [] };
  try {
    const database = await notion.databases.retrieve({
      database_id: DATABASE_ID,
    }) as DatabaseObjectResponse;

    const properties = database.properties;

    const usageProp = properties[PROP.USAGE];
    const structureTypeProp = properties[PROP.STRUCTURE_TYPE];
    const statusProp = properties[PROP.STATUS];

    return {
      usages:
        usageProp?.type === "multi_select"
          ? usageProp.multi_select.options.map((o) => o.name)
          : [],
      structureTypes:
        structureTypeProp?.type === "multi_select"
          ? structureTypeProp.multi_select.options.map((o) => o.name)
          : [],
      statuses:
        statusProp?.type === "select"
          ? statusProp.select.options.map((o) => o.name)
          : [],
    };
  } catch {
    return { usages: [], structureTypes: [], statuses: [] };
  }
}

// Notion DB에서 lastSyncTime 이후 변경된 페이지가 있는지 확인
export async function checkNotionUpdated(lastSyncTime: string | null): Promise<boolean> {
  if (!isConfigured()) return false;

  // 최초 동기화 (lastSyncTime 없음) → 무조건 동기화
  if (!lastSyncTime) return true;

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      page_size: 1,
      filter: {
        timestamp: "last_edited_time",
        last_edited_time: { after: lastSyncTime },
      },
    });

    return response.results.length > 0;
  } catch (error) {
    console.error("Notion 변경 감지 실패:", error);
    // 에러 시 안전하게 동기화 진행
    return true;
  }
}

// ─── 페이지/컴포넌트에서 사용하는 Public API ───

// 프로젝트 목록 (KV 캐시 → in-memory 필터)
export async function getProjects(filter?: {
  usage?: string;
  structureType?: string;
  status?: string;
}): Promise<Project[]> {
  const allProjects = await getAllProjectsCached();
  return filterProjects(allProjects, filter);
}

// 단일 프로젝트 조회 (KV 캐시에서 find)
export async function getProjectById(id: string): Promise<Project | null> {
  const allProjects = await getAllProjectsCached();
  return allProjects.find((p) => p.id === id) ?? null;
}

// 관련 프로젝트 조회 (KV 캐시에서 filter)
export async function getRelatedProjects(
  currentId: string,
  usages: string[],
): Promise<Project[]> {
  if (usages.length === 0) return [];

  const allProjects = await getAllProjectsCached();
  return allProjects
    .filter((p) => p.id !== currentId && p.usage.some((u) => usages.includes(u)))
    .slice(0, 4);
}

// 필터 옵션 (KV 캐시)
export async function getFilterOptions(): Promise<FilterOptions> {
  return getFilterOptionsCached();
}

// 프로젝트 이미지 블록 ID 목록 (상세 페이지 전용)
// URL이 아닌 블록 ID를 캐싱하여 Notion 임시 URL 만료 문제 방지
export const getProjectImageBlockIds = unstable_cache(
  async (pageId: string): Promise<string[]> => {
    if (!isConfigured()) return [];

    try {
      const blockIds: string[] = [];
      let cursor: string | undefined;
      let hasMore = true;

      while (hasMore) {
        const response = await notion.blocks.children.list({
          block_id: pageId,
          page_size: 100,
          start_cursor: cursor,
        });

        for (const block of response.results) {
          if ("type" in block && block.type === "image") {
            blockIds.push(block.id);
          }
        }

        hasMore = response.has_more;
        cursor = response.next_cursor ?? undefined;
      }

      return blockIds;
    } catch {
      return [];
    }
  },
  ["project-image-blocks"],
  { revalidate: 3600 },
);
