import { Project, FilterOptions } from "@/types";
import { kvGet, kvSet, isKvConfigured, CACHE_KEYS, CACHE_TTL } from "./kv";
import { fetchAllProjects, fetchFilterOptions, checkNotionUpdated } from "./notion";

// Stale-while-revalidate 임계값 (30분)
const STALE_THRESHOLD_MS = 30 * 60 * 1000;

// 백그라운드 동기화가 이미 진행 중인지 추적 (중복 실행 방지)
let revalidating = false;

// 백그라운드에서 변경 감지 + 동기화 (응답을 차단하지 않음)
function revalidateInBackground(): void {
  if (revalidating) return;
  revalidating = true;

  syncIfChanged()
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
// - KV 미스: Notion에서 직접 조회 후 KV 저장
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

// Notion 변경 감지 후 동기화 (Cron + 백그라운드에서 호출)
// force=true: 변경 여부와 관계없이 강제 재동기화
export async function syncIfChanged(force = false): Promise<{ synced: boolean; count: number }> {
  if (!force) {
    const lastSync = await kvGet<string>(CACHE_KEYS.LAST_SYNC);
    const hasChanges = await checkNotionUpdated(lastSync);

    if (!hasChanges) {
      // 변경 없어도 lastSync 갱신 (stale 판단 리셋)
      await kvSet(CACHE_KEYS.LAST_SYNC, new Date().toISOString());
      return { synced: false, count: 0 };
    }
  }

  // 전량 재동기화
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
