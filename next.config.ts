import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 프로젝트 커버는 거의 바뀌지 않는다. 최적화 결과를 오래 보관해
    // /api/notion-image 프록시(→ Notion API) 재호출을 줄인다.
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.notion.so",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
