/**
 * 사이트 전역 설정 (빌드할 때 환경변수에서 읽는다).
 * - SITE_URL: canonical·OG·sitemap 기준 주소. 도메인이 정해지면 바꾼다.
 * - NEXT_PUBLIC_APP_URL: 실제 MyFinSight 앱 주소. 아직 공개 주소가 없어 비어 있으면 시작 버튼이 설치 안내로 이어진다.
 * - NEXT_PUBLIC_REPO_URL: 소스 저장소. 기본값은 MyFinSight 의 origin.
 */
const clean = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);

export const site = {
  name: "MyFinSight",
  url: clean(process.env.SITE_URL) ?? "https://myfinsight.vercel.app",
  title: "MyFinSight — 투자 아이디어를 검증하는 포트폴리오 리포트",
  description:
    "말로 적은 투자 아이디어와 내 투자조건으로 종목을 고르고 비중을 계산한 뒤, 과거 데이터로 성과와 위험을 검증한 리포트를 받아 보세요. S&P 500, NASDAQ-100, KOSPI 200 종목을 다룹니다. 실제 매매는 하지 않습니다.",
  appUrl: clean(process.env.NEXT_PUBLIC_APP_URL),
  repoUrl: clean(process.env.NEXT_PUBLIC_REPO_URL) ?? "https://github.com/sumb-10/MyFinSight",
} as const;

export const nav = [
  { href: "#how", label: "작동 방식" },
  { href: "#tour", label: "리포트 둘러보기" },
  { href: "#verify", label: "검증 방식" },
  { href: "#after", label: "모의투자" },
  { href: "#faq", label: "자주 묻는 질문" },
] as const;

/** 시작 버튼: 앱 주소가 있으면 앱으로, 없으면 설치 안내로 */
export const startCta = site.appUrl
  ? { href: site.appUrl, label: "내 아이디어 검증하기", external: true }
  : { href: "#start", label: "설치해서 써 보기", external: false };
