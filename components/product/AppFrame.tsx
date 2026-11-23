import Glyph from "./Glyph";

/**
 * 앱 창 재현 프레임.
 * - 위 막대: 화면 이름 + "예시 화면" 표시 (실제 결과와 헷갈리지 않게 항상 보인다).
 * - 사이드바: 앱 사이드바(홈 · 새 분석 / 분석 리포트 / 모의투자 / 내 투자조건, 아래쪽에 연결 설정). 프레임이 넓을 때만 보인다.
 */
type Active = "home" | "reports" | "paper" | "profile";

const menu: { key: Active; label: string }[] = [
  { key: "home", label: "홈 · 새 분석" },
  { key: "reports", label: "분석 리포트" },
  { key: "paper", label: "모의투자" },
  { key: "profile", label: "내 투자조건" },
];

export function FrameBar({ title }: { title: string }) {
  return (
    <div className="flex h-9 items-center justify-between gap-3 border-b border-[#e2e8f0] bg-white px-3.5 text-[12px]">
      <span className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden font-medium text-ink-3">
        <span className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-[#dbe2ea]" />
          <span className="h-2 w-2 rounded-full bg-[#dbe2ea]" />
        </span>
        <span className="min-w-0 truncate">MyFinSight · {title}</span>
      </span>
      <span className="shrink-0 rounded-[4px] bg-mist px-1.5 py-0.5 font-semibold text-ink-3">예시 화면</span>
    </div>
  );
}

export default function AppFrame({
  title,
  active = "home",
  sidebar = true,
  className = "",
  children,
}: {
  title: string;
  active?: Active;
  sidebar?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`frame ${className}`}>
      <FrameBar title={title} />
      <div className="flex min-h-0">
        {sidebar && (
          <div className="app-sidebar hidden w-[168px] shrink-0 flex-col gap-1 border-r border-[#e2e8f0] bg-white px-2.5 py-4" aria-hidden="true">
            <div className="mb-3 flex items-center gap-2 px-1.5">
              <span className="grid h-6 w-6 place-items-center rounded-[6px] bg-[#1d4ed8]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </span>
              <span className="text-[13px] leading-tight font-bold">
                MyFinSight
                <span className="block text-[10px] font-medium text-ink-3">개인화 투자전략</span>
              </span>
            </div>
            {menu.map((m) => (
              <span
                key={m.key}
                className={`rounded-lg px-2.5 py-2 text-[12.5px] ${m.key === active ? "bg-[#eff6ff] font-semibold text-[#1d4ed8]" : "text-[#334155]"}`}
              >
                {m.label}
              </span>
            ))}
            <span className="mt-auto flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12.5px] text-[#334155]">
              <Glyph name="settings" size={14} />
              연결 설정
            </span>
          </div>
        )}
        <div className="app-body-main min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
