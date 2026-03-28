import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "(주)동양구조 - 구조설계 및 안전진단 전문업체";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const fontData = await fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-kr@latest/korean-700-normal.woff"
  ).then((res) => res.arrayBuffer());

  const fontDataRegular = await fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-kr@latest/korean-400-normal.woff"
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#2D3436",
          fontFamily: "NotoSansKR",
          position: "relative",
        }}
      >
        {/* 장식 라인 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: "#669900",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: -1,
            }}
          >
            (주)동양구조
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#669900",
              fontWeight: 500,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Dongyang Consulting Engineers
          </div>
          <div
            style={{
              width: 80,
              height: 2,
              backgroundColor: "#669900",
              marginTop: 8,
              marginBottom: 8,
            }}
          />
          <div
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.7)",
              fontWeight: 400,
            }}
          >
            구조설계 및 안전진단 전문업체
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "NotoSansKR", data: fontData, weight: 700, style: "normal" },
        { name: "NotoSansKR", data: fontDataRegular, weight: 400, style: "normal" },
      ],
    }
  );
}
