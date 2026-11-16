// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// 배포 도메인이 정해지면 SITE_URL 환경변수로 바꾼다 (canonical, og:url, sitemap 에 쓰인다).
const site = process.env.SITE_URL ?? "https://myfinsight.vercel.app";

export default defineConfig({
  site,
  integrations: [sitemap()],
  // 개발 서버 하단의 Astro 개발 도구 막대 끄기 (배포 빌드에는 원래 들어가지 않음)
  devToolbar: { enabled: false },
  vite: { plugins: [tailwindcss()] },
});
