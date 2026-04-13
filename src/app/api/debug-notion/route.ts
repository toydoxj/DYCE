import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DATABASE_ID = process.env.NOTION_DATABASE_ID ?? "";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // DB 스키마에서 파일 관련 속성 확인
    const db = await notion.databases.retrieve({ database_id: DATABASE_ID });
    const propTypes: Record<string, string> = {};
    for (const [name, prop] of Object.entries(db.properties)) {
      propTypes[name] = prop.type;
    }

    // 첫 번째 페이지의 블록 확인
    const queryRes = await notion.databases.query({
      database_id: DATABASE_ID,
      page_size: 1,
    });
    const page = queryRes.results[0] as PageObjectResponse;

    const blocks = await notion.blocks.children.list({
      block_id: page.id,
      page_size: 50,
    });

    const blockTypes = blocks.results.map((b) =>
      "type" in b ? { type: b.type, id: b.id } : { type: "unknown" },
    );

    // 파일 속성 값 확인
    const fileProps: Record<string, unknown> = {};
    for (const [name, prop] of Object.entries(page.properties)) {
      if (prop.type === "files") {
        fileProps[name] = prop.files;
      }
    }

    return NextResponse.json({
      dbProperties: propTypes,
      pageId: page.id,
      hasCover: page.cover !== null,
      coverType: page.cover?.type ?? null,
      blockTypes,
      blockCount: blocks.results.length,
      fileProps,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
