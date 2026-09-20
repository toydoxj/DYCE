import { Project, FilterOptions } from "@/types";

// dy-task(사내 업무관리) 공개 API — 수행실적의 주 데이터 소스
//
// 수행실적은 Notion 마스터 DB가 원본이지만, dy-task backend가 이미 그 DB를
// Postgres(mirror_master_projects)로 미러링하고 있다. Notion API를 직접 치는
// 대신 미러를 읽으면:
//   - rate limit(3 req/s)과 전량 페이지네이션에서 벗어나고
//   - 마스터 DB에 없는 진행단계/계약일을 하위 프로젝트에서 유도해 받을 수 있으며
//   - 커버 이미지 유무를 미리 알아 불필요한 이미지 프록시 호출을 건너뛴다
//
// dy-task 장애 시에는 notion.ts의 직결 경로로 폴백한다.

const API_BASE = process.env.DY_TASK_API_URL?.trim() || "https://api.dyce.kr";
const PUBLIC_KEY = process.env.DY_TASK_PUBLIC_KEY?.trim();

// mirror는 331건 규모라 응답이 크지 않지만, 서버가 느릴 때 페이지 렌더를
// 무한정 붙잡지 않도록 상한을 둔다.
const TIMEOUT_MS = 10_000;

// API 응답 타입 (backend/app/routers/public.py의 PublicProject와 대응)
interface DyTaskProject {
  id: string;
  project_name: string;
  code: string;
  usage: string[];
  structure_type: string[];
  height: number | null;
  total_floor_area: number | null;
  above_ground_floors: number | null;
  underground_floors: number | null;
  building_count: number | null;
  address: string;
  description: string;
  work_scope: string[];
  status: string;
  contract_date: string | null;
  image_kind: "cover" | "block" | "none" | "unknown";
  image_block_id: string | null;
}

interface DyTaskProjectList {
  items: DyTaskProject[];
  total: number;
  synced_at: string | null;
}

interface DyTaskFilterOptions {
  usages: string[];
  structure_types: string[];
  statuses: string[];
}

export function isDyTaskConfigured(): boolean {
  return !!API_BASE;
}

async function fetchJson<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (PUBLIC_KEY) headers["X-Public-Key"] = PUBLIC_KEY;

  const response = await fetch(`${API_BASE}/api/public${path}`, {
    headers,
    signal: AbortSignal.timeout(TIMEOUT_MS),
    // 캐싱은 KV 계층(notion-cache.ts)이 담당한다
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`dy-task API ${path} → ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// 이미지 프록시 경로 결정
// "none"이면 이미지가 없음이 확정된 상태라 프록시 호출 자체를 만들지 않는다.
// "unknown"은 본문이 아직 미러링되지 않은 경우 — 기존대로 커버 경로가 탐색한다.
function coverImagePath(project: DyTaskProject): string | null {
  switch (project.image_kind) {
    case "none":
      return null;
    case "block":
      return project.image_block_id
        ? `/api/notion-image/block/${project.image_block_id}`
        : null;
    default:
      return `/api/notion-image/cover/${project.id}`;
  }
}

function toProject(item: DyTaskProject): Project {
  return {
    id: item.id,
    projectName: item.project_name,
    code: item.code,
    usage: item.usage,
    structureType: item.structure_type,
    height: item.height,
    totalFloorArea: item.total_floor_area,
    aboveGroundFloors: item.above_ground_floors,
    undergroundFloors: item.underground_floors,
    buildingCount: item.building_count,
    address: item.address,
    // backend 배포 시차 동안 필드가 없을 수 있다 (구 캐시·구 응답)
    description: item.description ?? "",
    workScope: item.work_scope,
    status: item.status,
    contractDate: item.contract_date,
    coverImage: coverImagePath(item),
  };
}

// 전체 프로젝트 목록 (mirror 전량, 페이지네이션 없음)
export async function fetchAllProjectsFromDyTask(): Promise<Project[]> {
  const data = await fetchJson<DyTaskProjectList>("/projects");
  return data.items.map(toProject);
}

// 필터 옵션 (실제 데이터에 존재하는 값만)
export async function fetchFilterOptionsFromDyTask(): Promise<FilterOptions> {
  const data = await fetchJson<DyTaskFilterOptions>("/projects/filter-options");
  return {
    usages: data.usages,
    structureTypes: data.structure_types,
    statuses: data.statuses,
  };
}
