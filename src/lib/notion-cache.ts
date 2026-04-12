import { Project, FilterOptions } from "@/types";
import { kvGet, kvSet, isKvConfigured, CACHE_KEYS, CACHE_TTL } from "./kv";
import { fetchAllProjects, fetchFilterOptions, checkNotionUpdated } from "./notion";

// KV 캐시에서 전체 프로젝트 목록 조회 (미스 시 Notion에서 fetch)
export async function getAllProjectsCached(): Promise<Project[]> {
  if (isKvConfigured()) {
    const cached = await kvGet<Project[]>(CACHE_KEYS.ALL_PROJECTS);
    if (cached) return cached;
  }

  // KV 미설정 또는 캐시 미스 → Notion에서 직접 조회
  const projects = await fetchAllProjects();

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

  const options = await fetchFilterOptions();

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

// Notion 변경 감지 후 동기화 (Cron에서 호출)
export async function syncIfChanged(): Promise<{ synced: boolean; count: number }> {
  const lastSync = await kvGet<string>(CACHE_KEYS.LAST_SYNC);
  const hasChanges = await checkNotionUpdated(lastSync);

  if (!hasChanges) {
    return { synced: false, count: 0 };
  }

  // 변경 감지됨 → 전량 재동기화
  const [projects, filterOptions] = await Promise.all([
    fetchAllProjects(),
    fetchFilterOptions(),
  ]);

  await Promise.all([
    kvSet(CACHE_KEYS.ALL_PROJECTS, projects, CACHE_TTL.PROJECTS),
    kvSet(CACHE_KEYS.FILTER_OPTIONS, filterOptions, CACHE_TTL.FILTER_OPTIONS),
    kvSet(CACHE_KEYS.LAST_SYNC, new Date().toISOString()),
  ]);

  return { synced: true, count: projects.length };
}
