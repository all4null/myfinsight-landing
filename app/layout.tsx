import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  icons: { icon: { url: "/favicon.svg", type: "image/svg+xml" } },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "MyFinSight 리포트 화면과 조건 점검 결과" }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preload" href="/fonts/pretendard-subset.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="bg-paper text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:text-white"
        >
          본문으로 건너뛰기
        </a>
        {children}
      </body>
    </html>
  );
}
