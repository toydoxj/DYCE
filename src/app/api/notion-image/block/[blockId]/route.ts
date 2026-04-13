import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// 블록 이미지 프록시: Notion 임시 URL 만료 문제 해결
// /api/notion-image/block/[blockId] → 302 redirect to fresh Notion URL
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ blockId: string }> },
) {
  const { blockId } = await params;

  try {
    const block = await notion.blocks.retrieve({ block_id: blockId });

    if (!("type" in block) || block.type !== "image") {
      return new NextResponse(null, { status: 404 });
    }

    const image = block.image;
    let url: string | null = null;
    if (image.type === "file") url = image.file.url;
    else if (image.type === "external") url = image.external.url;

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
