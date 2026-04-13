import { NextRequest, NextResponse } from "next/server";
import { isKvConfigured } from "@/lib/kv";
import { syncIfChanged } from "@/lib/notion-cache";

export async function GET(req: NextRequest) {
  // CRON_SECRET 인증 (Vercel Cron은 Authorization 헤더로 전달)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isKvConfigured()) {
    return NextResponse.json({ error: "KV가 설정되지 않았습니다" }, { status: 503 });
  }

  try {
    const force = req.nextUrl.searchParams.get("force") === "true";
    const result = await syncIfChanged(force);

    return NextResponse.json({
      ok: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("프로젝트 동기화 실패:", error);
    return NextResponse.json(
      { error: "동기화 중 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}
