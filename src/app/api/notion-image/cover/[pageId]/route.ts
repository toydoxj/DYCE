import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// 페이지 본문에서 첫 번째 이미지 URL 추출 (커버 없을 때 폴백)
async function getFirstBlockImage(pageId: string): Promise<string | null> {
  const response = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 20,
  });

  for (const block of response.results) {
    if ("type" in block && block.type === "image") {
      const image = block.image;
      if (image.type === "file") return image.file.url;
      if (image.type === "external") return image.external.url;
    }
  }
  return null;
}

// 이미지 프록시: 커버 → 본문 첫 이미지 순으로 탐색
// /api/notion-image/cover/[pageId] → 302 redirect to fresh Notion URL
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pageId: string }> },
) {
  const { pageId } = await params;

  try {
    const page = (await notion.pages.retrieve({ page_id: pageId })) as PageObjectResponse;

    // 1순위: 커버 이미지
    let url: string | null = null;
    if (page.cover?.type === "file") url = page.cover.file.url;
    else if (page.cover?.type === "external") url = page.cover.external.url;

    // 2순위: 본문 첫 이미지 블록
    if (!url) {
      url = await getFirstBlockImage(pageId);
    }

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
