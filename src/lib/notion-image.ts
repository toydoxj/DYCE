// Notion 이미지 프록시 공통 로직
// 302 redirect 대신 바이너리를 직접 스트리밍한다. redirect는 Notion signed URL
// (1시간 만료)을 클라이언트에 넘기므로 CDN 캐싱이 무의미했고, 카드 하나당 Notion
// API 호출이 매번 발생했다. 스트리밍하면 응답 자체가 CDN에 캐싱되어 캐시 유효
// 기간 동안 Notion 호출이 사라진다.

// 하루 보관 + 일주일간 stale 허용 (만료 후 백그라운드 갱신)
const CACHE_CONTROL = "public, s-maxage=86400, stale-while-revalidate=604800";

// 이미지 부재는 짧게만 캐싱 — 나중에 이미지를 추가해도 곧 반영되도록
const MISS_CACHE_CONTROL = "public, s-maxage=60";

export function imageMissResponse(): Response {
  return new Response(null, {
    status: 404,
    headers: { "Cache-Control": MISS_CACHE_CONTROL },
  });
}

// Notion 이미지 URL을 받아 바이너리를 그대로 흘려보낸다
export async function streamNotionImage(url: string): Promise<Response> {
  const upstream = await fetch(url);

  if (!upstream.ok || !upstream.body) {
    return imageMissResponse();
  }

  const headers = new Headers({
    "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
    "Cache-Control": CACHE_CONTROL,
  });

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);

  return new Response(upstream.body, { status: 200, headers });
}
