import { Client } from "@notionhq/client";
import { Project, FilterOptions } from "@/types";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID ?? "";

// API 키가 설정되지 않은 경우 빈 결과 반환
function isConfigured(): boolean {
  return !!(process.env.NOTION_API_KEY && process.env.NOTION_API_KEY !== "secret_xxxxx");
}

// Notion 속성에서 텍스트 값 추출
function getTitle(property: unknown): string {
  const prop = property as { type: string; title: Array<{ plain_text: string }> };
  if (prop?.type === "title" && prop.title?.length > 0) {
    return prop.title.map((t) => t.plain_text).join("");
  }
  return "";
}

function getRichText(property: unknown): string {
  const prop = property as { type: string; rich_text: Array<{ plain_text: string }> };
  if (prop?.type === "rich_text" && prop.rich_text?.length > 0) {
    return prop.rich_text.map((t) => t.plain_text).join("");
  }
  return "";
}

function getNumber(property: unknown): number | null {
  const prop = property as { type: string; number: number | null };
  if (prop?.type === "number") {
    return prop.number;
  }
  return null;
}

function getMultiSelect(property: unknown): string[] {
  const prop = property as { type: string; multi_select: Array<{ name: string }> };
  if (prop?.type === "multi_select") {
    return prop.multi_select.map((s) => s.name);
  }
  return [];
}

function getSelect(property: unknown): string {
  const prop = property as { type: string; select: { name: string } | null };
  if (prop?.type === "select" && prop.select) {
    return prop.select.name;
  }
  return "";
}

function getDate(property: unknown): string | null {
  const prop = property as { type: string; date: { start: string } | null };
  if (prop?.type === "date" && prop.date) {
    return prop.date.start;
  }
  return null;
}

// Notion 페이지를 Project 타입으로 변환
function pageToProject(page: Record<string, unknown>): Project {
  const properties = page.properties as Record<string, unknown>;

  return {
    id: page.id as string,
    projectName: getTitle(properties["용역명"]),
    code: getRichText(properties["MASTER_CODE"]),
    usage: getMultiSelect(properties["용도"]),
    structureType: getMultiSelect(properties["구조형식"]),
    height: getNumber(properties["높이"]),
    totalFloorArea: getNumber(properties["연면적"]),
    aboveGroundFloors: getNumber(properties["지상층수"]),
    undergroundFloors: getNumber(properties["지하층수"]),
    buildingCount: getNumber(properties["동수"]),
    address: getRichText(properties["주소"]),
    status: getSelect(properties["진행단계"]),
    contractDate: getDate(properties["계약일"]),
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
      property: "용도",
      multi_select: { contains: filter.usage },
    });
  }
  if (filter?.structureType) {
    filterConditions.push({
      property: "구조형식",
      multi_select: { contains: filter.structureType },
    });
  }
  if (filter?.status) {
    filterConditions.push({
      property: "진행단계",
      select: { equals: filter.status },
    });
  }

  const queryParams: Record<string, unknown> = {
    database_id: DATABASE_ID,
    page_size: 100,
    sorts: [
      {
        property: "계약일",
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

    const projects = response.results.map((page) =>
      pageToProject(page as unknown as Record<string, unknown>)
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

// 필터 옵션 추출
export async function getFilterOptions(): Promise<FilterOptions> {
  if (!isConfigured()) return { usages: [], structureTypes: [], statuses: [] };
  try {
    const database = await notion.databases.retrieve({
      database_id: DATABASE_ID,
    });

    const properties = (database as unknown as { properties: Record<string, unknown> }).properties;

    const usageProperty = properties["용도"] as {
      multi_select?: { options: Array<{ name: string }> };
    };
    const structureTypeProperty = properties["구조형식"] as {
      multi_select?: { options: Array<{ name: string }> };
    };
    const statusProperty = properties["진행단계"] as {
      select?: { options: Array<{ name: string }> };
    };

    return {
      usages: usageProperty?.multi_select?.options.map((o) => o.name) ?? [],
      structureTypes: structureTypeProperty?.multi_select?.options.map((o) => o.name) ?? [],
      statuses: statusProperty?.select?.options.map((o) => o.name) ?? [],
    };
  } catch {
    return { usages: [], structureTypes: [], statuses: [] };
  }
}
