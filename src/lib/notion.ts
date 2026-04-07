import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  DatabaseObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Project, FilterOptions } from "@/types";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID ?? "";

// Notion 속성 이름 상수
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

// Notion 속성에서 텍스트 값 추출
function getTitle(property: PropertyValue): string {
  if (property.type === "title" && property.title.length > 0) {
    return property.title.map((t) => t.plain_text).join("");
  }
  return "";
}

function getRichText(property: PropertyValue): string {
  if (property.type === "rich_text" && property.rich_text.length > 0) {
    return property.rich_text.map((t) => t.plain_text).join("");
  }
  return "";
}

function getNumber(property: PropertyValue): number | null {
  if (property.type === "number") {
    return property.number;
  }
  return null;
}

function getMultiSelect(property: PropertyValue): string[] {
  if (property.type === "multi_select") {
    return property.multi_select.map((s) => s.name);
  }
  return [];
}

function getSelect(property: PropertyValue): string {
  if (property.type === "select" && property.select) {
    return property.select.name;
  }
  return "";
}

function getDate(property: PropertyValue): string | null {
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
    status: getSelect(p[PROP.STATUS]),
    contractDate: getDate(p[PROP.CONTRACT_DATE]),
    coverImage,
  };
}

// 프로젝트 목록 가져오기
export async function getProjects(filter?: {
  usage?: string;
  structureType?: string;
  status?: string;
}): Promise<Project[]> {
  if (!isConfigured()) return [];

  try {
    const filterConditions: Array<{
      property: string;
      multi_select?: { contains: string };
      select?: { equals: string };
    }> = [];

    if (filter?.usage) {
      filterConditions.push({
        property: PROP.USAGE,
        multi_select: { contains: filter.usage },
      });
    }
    if (filter?.structureType) {
      filterConditions.push({
        property: PROP.STRUCTURE_TYPE,
        multi_select: { contains: filter.structureType },
      });
    }
    if (filter?.status) {
      filterConditions.push({
        property: PROP.STATUS,
        select: { equals: filter.status },
      });
    }

    const queryParams: Record<string, unknown> = {
      database_id: DATABASE_ID,
      page_size: 100,
      sorts: [
        {
          property: PROP.CONTRACT_DATE,
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

      const projects = await Promise.all(
        pages.map(async (page) => {
          const cover = getCoverImage(page);
          const image = cover ?? (await getFirstImage(page.id));
          return pageToProject(page, image);
        })
      );
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

// 단일 프로젝트 조회
export async function getProjectById(id: string): Promise<Project | null> {
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

// 페이지 본문의 모든 이미지 URL 추출
export async function getProjectImages(pageId: string): Promise<string[]> {
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

// 같은 용도의 관련 프로젝트 조회 (최대 4개)
export async function getRelatedProjects(
  currentId: string,
  usages: string[],
): Promise<Project[]> {
  if (!isConfigured() || usages.length === 0) return [];

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      page_size: 5,
      filter: {
        property: PROP.USAGE,
        multi_select: { contains: usages[0] },
      },
      sorts: [{ property: PROP.CONTRACT_DATE, direction: "descending" }],
    });

    const pages = response.results.filter(
      (page): page is PageObjectResponse =>
        "properties" in page && page.id !== currentId,
    );

    const projects = await Promise.all(
      pages.slice(0, 4).map(async (page) => {
        const cover = getCoverImage(page);
        const image = cover ?? (await getFirstImage(page.id));
        return pageToProject(page, image);
      }),
    );

    return projects;
  } catch {
    return [];
  }
}

// 필터 옵션 추출
export async function getFilterOptions(): Promise<FilterOptions> {
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
        usageProp.type === "multi_select"
          ? usageProp.multi_select.options.map((o) => o.name)
          : [],
      structureTypes:
        structureTypeProp.type === "multi_select"
          ? structureTypeProp.multi_select.options.map((o) => o.name)
          : [],
      statuses:
        statusProp.type === "select"
          ? statusProp.select.options.map((o) => o.name)
          : [],
    };
  } catch {
    return { usages: [], structureTypes: [], statuses: [] };
  }
}
