import { NextRequest } from "next/server";
import { Client } from "@notionhq/client";
import { streamNotionImage, imageMissResponse } from "@/lib/notion-image";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// 블록 이미지 프록시: Notion 임시 URL 만료 문제 해결
// /api/notion-image/block/[blockId]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ blockId: string }> },
) {
  const { blockId } = await params;

  try {
    const block = await notion.blocks.retrieve({ block_id: blockId });

    if (!("type" in block) || block.type !== "image") {
      return imageMissResponse();
    }

    const image = block.image;
    let url: string | null = null;
    if (image.type === "file") url = image.file.url;
    else if (image.type === "external") url = image.external.url;

    if (!url) {
      return imageMissResponse();
    }

    return streamNotionImage(url);
  } catch {
    return imageMissResponse();
  }
}
