import { Client } from "@notionhq/client";
import { unstable_cache } from "next/cache";
import type {
  PageObjectResponse,
  DatabaseObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Project, FilterOptions } from "@/types";

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

// 페이지 본문에서 첫 번째 이미지 URL 추출
async function getFirstImage(pageId: string): Promise<string | null> {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 20,
    });

    for (const block of response.results) {
      if ("type" in block && block.type === "image") {
        const image = block.image;
        if (image.type === "file") {
          return image.file.url;
        }
        if (image.type === "external") {
          return image.external.url;
        }
      }
    }
  } catch {
    // 블록 조회 실패 시 무시
  }
  return null;
}

// 페이지 커버 이미지 URL 추출
function getCoverImage(page: PageObjectResponse): string | null {
  if (!page.cover) return null;
  if (page.cover.type === "file") return page.cover.file.url;
  if (page.cover.type === "external") return page.cover.external.url;
  return null;
}

// Notion 페이지를 Project 타입으로 변환
function pageToProject(page: PageObjectResponse, coverImage: string | null): Project {
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

// 프로젝트 목록 가져오기 (내부 구현)
async function fetchProjects(
  usage?: string,
  structureType?: string,
  status?: string,
): Promise<Project[]> {
  if (!isConfigured()) return [];

  try {
    const filterConditions: Array<{
      property: string;
      multi_select?: { contains: string };
      select?: { equals: string };
    }> = [];

    if (usage) {
      filterConditions.push({
        property: PROP.USAGE,
        multi_select: { contains: usage },
      });
    }
    if (structureType) {
      filterConditions.push({
        property: PROP.STRUCTURE_TYPE,
        multi_select: { contains: structureType },
      });
    }
    if (status) {
      filterConditions.push({
        property: PROP.STATUS,
        select: { equals: status },
      });
    }

    const queryParams: Record<string, unknown> = {
      database_id: DATABASE_ID,
      page_size: 100,
      sorts: [
        {
          timestamp: "created_time",
          direction: "descending",
        },
      ],
    };

    if (filterConditions.length > 0) {
      queryParams.filter =
        filterConditions.length === 1
          ? filterConditions[0]
          : { and: filterConditions };
    }

    const allResults: Project[] = [];
    let hasMore = true;
    let startCursor: string | undefined;

    while (hasMore) {
      const response = await notion.databases.query({
        ...queryParams,
        start_cursor: startCursor,
      } as Parameters<typeof notion.databases.query>[0]);

      const pages = response.results.filter(
        (page): page is PageObjectResponse => "properties" in page
      );

      // 목록 조회에서는 커버 이미지만 사용 (N+1 getFirstImage 호출 제거)
      const projects = pages.map((page) => {
        const cover = getCoverImage(page);
        return pageToProject(page, cover);
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

// unstable_cache로 캐싱된 프로젝트 목록
export async function getProjects(filter?: {
  usage?: string;
  structureType?: string;
  status?: string;
}): Promise<Project[]> {
  const usage = filter?.usage ?? "";
  const structureType = filter?.structureType ?? "";
  const status = filter?.status ?? "";

  const cached = unstable_cache(
    () => fetchProjects(usage, structureType, status),
    ["projects", usage, structureType, status],
    { tags: ["projects"], revalidate: 3600 },
  );

  return cached();
}

// 단일 프로젝트 조회 (내부 구현)
async function fetchProjectById(id: string): Promise<Project | null> {
  if (!isConfigured()) return null;

  try {
    const page = await notion.pages.retrieve({ page_id: id });
    if (!("properties" in page)) return null;

    const typedPage = page as PageObjectResponse;
    const cover = getCoverImage(typedPage);
    const image = cover ?? (await getFirstImage(typedPage.id));
    return pageToProject(typedPage, image);
  } catch (error) {
    console.error("Notion API 프로젝트 상세 조회 실패:", error);
    return null;
  }
}

// 캐싱된 단일 프로젝트 조회
export async function getProjectById(id: string): Promise<Project | null> {
  const cached = unstable_cache(
    () => fetchProjectById(id),
    ["project", id],
    { tags: ["projects", `project-${id}`], revalidate: 3600 },
  );

  return cached();
}

// 페이지 본문의 모든 이미지 URL 추출 (내부 구현)
async function fetchProjectImages(pageId: string): Promise<string[]> {
  if (!isConfigured()) return [];

  try {
    const images: string[] = [];
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
          const image = block.image;
          if (image.type === "file") images.push(image.file.url);
          else if (image.type === "external") images.push(image.external.url);
        }
      }

      hasMore = response.has_more;
      cursor = response.next_cursor ?? undefined;
    }

    return images;
  } catch {
    return [];
  }
}

// 캐싱된 프로젝트 이미지 조회
export async function getProjectImages(pageId: string): Promise<string[]> {
  const cached = unstable_cache(
    () => fetchProjectImages(pageId),
    ["project-images", pageId],
    { tags: [`project-${pageId}`], revalidate: 3600 },
  );

  return cached();
}

// 같은 용도의 관련 프로젝트 조회 (최대 4개, 내부 구현)
async function fetchRelatedProjects(
  currentId: string,
  firstUsage: string,
): Promise<Project[]> {
  if (!isConfigured()) return [];

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      page_size: 5,
      filter: {
        property: PROP.USAGE,
        multi_select: { contains: firstUsage },
      },
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    });

    const pages = response.results.filter(
      (page): page is PageObjectResponse =>
        "properties" in page && page.id !== currentId,
    );

    // 관련 프로젝트도 커버 이미지만 사용 (N+1 제거)
    return pages.slice(0, 4).map((page) => {
      const cover = getCoverImage(page);
      return pageToProject(page, cover);
    });
  } catch {
    return [];
  }
}

// 캐싱된 관련 프로젝트 조회
export async function getRelatedProjects(
  currentId: string,
  usages: string[],
): Promise<Project[]> {
  if (usages.length === 0) return [];

  const cached = unstable_cache(
    () => fetchRelatedProjects(currentId, usages[0]),
    ["related-projects", currentId, usages[0]],
    { tags: ["projects"], revalidate: 3600 },
  );

  return cached();
}

// 필터 옵션 추출 (DB 스키마는 자주 변경되지 않으므로 더 긴 캐시)
export const getFilterOptions = unstable_cache(
  async (): Promise<FilterOptions> => {
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
  },
  ["filter-options"],
  { tags: ["filter-options"], revalidate: 86400 },
);
