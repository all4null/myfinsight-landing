/** 앱 사이드바의 로고(파란 사각형 + 상승선 아이콘 + 글자). 아이콘 선은 lucide "trending-up" (ISC). */
export default function Logo({ size = 30, tone = "dark" }: { size?: number; tone?: "dark" | "light" }) {
  const dark = tone === "dark";
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <rect width="32" height="32" rx="8" fill={dark ? "#1d4ed8" : "#ffffff"} />
        <g
          fill="none"
          stroke={dark ? "#ffffff" : "#1d4ed8"}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(5 5) scale(0.917)"
        >
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </g>
      </svg>
      <span className={`text-[19px] font-bold tracking-[-0.02em] ${dark ? "text-ink" : "text-white"}`}>MyFinSight</span>
    </span>
  );
}
