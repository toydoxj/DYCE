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

// Lazy 초기화 (빌드 시 환경변수 부재로 인한 에러 방지)
let redis: Redis | null = null;
let redisChecked = false;

function getRedis(): Redis | null {
  if (redisChecked) return redis;
  redisChecked = true;

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) return null;

  redis = new Redis({ url, token });
  return redis;
}

// KV 사용 가능 여부
export function isKvConfigured(): boolean {
  return getRedis() !== null;
}

// KV에서 값 조회 (미설정 시 null)
export async function kvGet<T>(key: string): Promise<T | null> {
  const client = getRedis();
  if (!client) return null;
  try {
    return await client.get<T>(key);
  } catch (error) {
    console.error(`KV GET 실패 [${key}]:`, error);
    return null;
  }
}

// KV에 값 저장 (미설정 시 무시)
export async function kvSet<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
  const client = getRedis();
  if (!client) return;
  try {
    if (ttlSeconds) {
      await client.set(key, value, { ex: ttlSeconds });
    } else {
      await client.set(key, value);
    }
  } catch (error) {
    console.error(`KV SET 실패 [${key}]:`, error);
  }
}
