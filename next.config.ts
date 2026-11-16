import type { NextConfig } from "next";

// 정적 내보내기: `next build` 결과가 out/ 에 HTML 로 생긴다 (Vercel 이나 아무 정적 호스팅에 올릴 수 있다)
const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
