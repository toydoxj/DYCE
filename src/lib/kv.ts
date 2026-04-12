import { Redis } from "@upstash/redis";

// KV 캐시 키 상수
export const CACHE_KEYS = {
  ALL_PROJECTS: "projects:all",
  FILTER_OPTIONS: "projects:filter-options",
  LAST_SYNC: "projects:last-sync",
} as const;

// TTL (초)
export const CACHE_TTL = {
  PROJECTS: 60 * 60 * 24, // 24시간
  FILTER_OPTIONS: 60 * 60 * 24 * 7, // 7일
} as const;

// Upstash Redis 환경변수가 설정된 경우에만 인스턴스 생성
function createRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  return new Redis({ url, token });
}

const redis = createRedisClient();

// KV 사용 가능 여부
export function isKvConfigured(): boolean {
  return redis !== null;
}

// KV에서 값 조회 (미설정 시 null)
export async function kvGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    return await redis.get<T>(key);
  } catch (error) {
    console.error(`KV GET 실패 [${key}]:`, error);
    return null;
  }
}

// KV에 값 저장 (미설정 시 무시)
export async function kvSet<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
  if (!redis) return;
  try {
    if (ttlSeconds) {
      await redis.set(key, value, { ex: ttlSeconds });
    } else {
      await redis.set(key, value);
    }
  } catch (error) {
    console.error(`KV SET 실패 [${key}]:`, error);
  }
}
