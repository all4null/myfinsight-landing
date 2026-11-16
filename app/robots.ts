import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

// sitemap 주소가 SITE_URL 을 따라가도록 public/robots.txt 대신 코드로 만든다
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", site.url).href,
  };
}
