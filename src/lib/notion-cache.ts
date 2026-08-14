import { Project, FilterOptions } from "@/types";
import { kvGet, kvSet, isKvConfigured, CACHE_KEYS, CACHE_TTL } from "./kv";
import { fetchAllProjects, fetchFilterOptions } from "./notion";
import {
  fetchAllProjectsFromDyTask,
  fetchFilterOptionsFromDyTask,
} from "./dy-task";

// Stale-while-revalidate 임계값 (30분)
const STALE_THRESHOLD_MS = 30 * 60 * 1000;

// 백그라운드 동기화가 이미 진행 중인지 추적 (중복 실행 방지)
let revalidating = false;

// 데이터 출처 — 운영 진단용으로 동기화 결과에 실어 보낸다
export type ProjectSource = "dy-task" | "notion";

// ─── 데이터 소스: dy-task mirror 우선, 실패 시 Notion 직결 ───

async function fetchProjectsFromSource(): Promise<{
  projects: Project[];
  source: ProjectSource;
}> {
  try {
    return { projects: await fetchAllProjectsFromDyTask(), source: "dy-task" };
  } catch (error) {
    console.error("dy-task 프로젝트 조회 실패 — Notion 직결로 폴백:", error);
    return { projects: await fetchAllProjects(), source: "notion" };
  }
}

async function fetchFilterOptionsFromSource(): Promise<FilterOptions> {
  try {
    return await fetchFilterOptionsFromDyTask();
  } catch (error) {
    console.error("dy-task 필터 옵션 조회 실패 — Notion 직결로 폴백:", error);
    return fetchFilterOptions();
  }
}

// 백그라운드에서 동기화 (응답을 차단하지 않음)
function revalidateInBackground(): void {
  if (revalidating) return;
  revalidating = true;

  syncProjects()
    .catch((error) => console.error("백그라운드 동기화 실패:", error))
    .finally(() => { revalidating = false; });
}

// lastSync가 STALE_THRESHOLD보다 오래되었는지 확인
async function isStale(): Promise<boolean> {
  const lastSync = await kvGet<string>(CACHE_KEYS.LAST_SYNC);
  if (!lastSync) return true;

  const elapsed = Date.now() - new Date(lastSync).getTime();
  return elapsed > STALE_THRESHOLD_MS;
}

// KV 캐시에서 전체 프로젝트 목록 조회
// - KV 히트: 즉시 반환 (stale이면 백그라운드 갱신 트리거)
// - KV 미스: 소스에서 직접 조회 후 KV 저장
export async function getAllProjectsCached(): Promise<Project[]> {
  if (isKvConfigured()) {
    const cached = await kvGet<Project[]>(CACHE_KEYS.ALL_PROJECTS);
    if (cached) {
      // Stale-while-revalidate: 오래되었으면 백그라운드에서 갱신
      const stale = await isStale();
      if (stale) revalidateInBackground();
      return cached;
    }
  }

  const { projects } = await fetchProjectsFromSource();

  if (isKvConfigured()) {
    await kvSet(CACHE_KEYS.ALL_PROJECTS, projects, CACHE_TTL.PROJECTS);
    await kvSet(CACHE_KEYS.LAST_SYNC, new Date().toISOString());
  }

  return projects;
}

// KV 캐시에서 필터 옵션 조회
export async function getFilterOptionsCached(): Promise<FilterOptions> {
  if (isKvConfigured()) {
    const cached = await kvGet<FilterOptions>(CACHE_KEYS.FILTER_OPTIONS);
    if (cached) return cached;
  }

  const options = await fetchFilterOptionsFromSource();

  if (isKvConfigured()) {
    await kvSet(CACHE_KEYS.FILTER_OPTIONS, options, CACHE_TTL.FILTER_OPTIONS);
  }

  return options;
}

// in-memory 필터링
export function filterProjects(
  projects: Project[],
  filter?: { usage?: string; structureType?: string; status?: string },
): Project[] {
  if (!filter) return projects;

  return projects.filter((p) => {
    if (filter.usage && !p.usage.includes(filter.usage)) return false;
    if (filter.structureType && !p.structureType.includes(filter.structureType)) return false;
    if (filter.status && p.status !== filter.status) return false;
    return true;
  });
}

// 전량 재동기화 (Cron + 백그라운드에서 호출)
//
// 예전에는 Notion에 "변경 있었나"를 먼저 물어보고 변경 시에만 전량을 다시
// 끌어왔다. dy-task 미러는 전량 조회가 HTTP 요청 1회라 그 사전 확인이
// 오히려 비용이어서 항상 동기화한다.
export async function syncProjects(): Promise<{
  count: number;
  source: ProjectSource;
}> {
  const [{ projects, source }, filterOptions] = await Promise.all([
    fetchProjectsFromSource(),
    fetchFilterOptionsFromSource(),
  ]);

  await Promise.all([
    kvSet(CACHE_KEYS.ALL_PROJECTS, projects, CACHE_TTL.PROJECTS),
    kvSet(CACHE_KEYS.FILTER_OPTIONS, filterOptions, CACHE_TTL.FILTER_OPTIONS),
    kvSet(CACHE_KEYS.LAST_SYNC, new Date().toISOString()),
  ]);

  return { count: projects.length, source };
}
