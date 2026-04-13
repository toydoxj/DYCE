import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// 커버 이미지 프록시: Notion 임시 URL 만료 문제 해결
// /api/notion-image/cover/[pageId] → 302 redirect to fresh Notion URL
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pageId: string }> },
) {
  const { pageId } = await params;

  try {
    const page = (await notion.pages.retrieve({ page_id: pageId })) as PageObjectResponse;

    let url: string | null = null;
    if (page.cover?.type === "file") url = page.cover.file.url;
    else if (page.cover?.type === "external") url = page.cover.external.url;

    if (!url) {
      return new NextResponse(null, { status: 404 });
    }

    return NextResponse.redirect(url, {
      status: 302,
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
