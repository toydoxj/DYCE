import { NextRequest } from "next/server";
import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { streamNotionImage, imageMissResponse } from "@/lib/notion-image";

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

// 이미지 프록시: 커버 → 본문 첫 이미지 순으로 탐색 후 바이너리 스트리밍
// /api/notion-image/cover/[pageId]
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
      return imageMissResponse();
    }

    return streamNotionImage(url);
  } catch (error) {
    console.error(`[notion-image/cover] pageId=${pageId}`, error);
    return imageMissResponse();
  }
}
