/**
 * "작동 방식" 단계별 앱 화면 재현. 문구는 앱 Front/src 의 실제 문구를 따른다.
 * - IdeaScreen: home/HomeScreen.tsx
 * - ClarifyScreen: analysis/ClarifyScreen.tsx
 * - ConfirmScreen: analysis/ConfirmScreen.tsx
 * - RunScreen: run/RunScreen.tsx · steps.ts (5묶음 14단계). data-run 목록의 진행 연출은 Flow 가 맡는다.
 */
import { scenario, question, conditions, runGroups } from "@/lib/example";

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-bold tracking-[0.08em] text-[#1d4ed8]">{children}</p>
);
const Title = ({ children, ...rest }: { children: React.ReactNode } & React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className="mt-1 text-[19px] leading-snug font-bold tracking-[-0.02em]" {...rest}>
    {children}
  </p>
);

export function IdeaScreen() {
  const examples = ["미국 반도체 기업 중 실적이 좋은 곳에 나눠 투자하고 싶어요.", "배당을 꾸준히 주는 한국 대형주로 모으고 싶어요."];
  return (
    <div className="scr px-4 py-5 text-[#0f172a]">
      <Eyebrow>개인화 투자전략</Eyebrow>
      <Title>투자 아이디어를 포트폴리오로 확인해보세요.</Title>
      <p className="mt-1.5 text-[12px] leading-relaxed text-[#475569]">내 투자조건을 반영해 종목을 고르고, 과거 데이터로 성과와 위험을 검증합니다.</p>
      <div className="app-card mt-4 p-3">
        <p className="min-h-[64px] text-[13px] leading-relaxed">
          {scenario.idea}
          <span className="caret" aria-hidden="true" />
        </p>
        <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#e2e8f0] pt-2.5" aria-hidden="true">
          <span className="rounded-lg border border-[#cbd5e1] px-2.5 py-1 text-[11.5px] font-semibold text-[#334155]">상세 조건</span>
          <span className="rounded-lg bg-[#1d4ed8] px-3 py-1.5 text-[12px] font-semibold text-white">투자조건 확인하기 ›</span>
        </div>
      </div>
      <ul className="mt-3 flex flex-col gap-1.5 text-[11.5px] text-[#475569]">
        {examples.map((e) => (
          <li key={e} className="rounded-lg bg-white px-2.5 py-1.5 ring-1 ring-[#e2e8f0]">
            {e}
          </li>
        ))}
      </ul>
      <div className="app-card mt-3 grid grid-cols-3 gap-2 px-3 py-2.5 text-[11.5px]">
        <p className="col-span-3 text-[12px] font-bold">저장된 기본 투자조건</p>
        <div>
          <p className="text-[#56667c]">금액</p>
          <p className="num font-semibold">2,000만 원</p>
        </div>
        <div>
          <p className="text-[#56667c]">기간</p>
          <p className="font-semibold">3년</p>
        </div>
        <div>
          <p className="text-[#56667c]">성향</p>
          <p className="font-semibold">위험중립형</p>
        </div>
      </div>
    </div>
  );
}

export function ClarifyScreen() {
  return (
    <div className="scr px-4 py-5 text-[#0f172a]">
      <Eyebrow>새 분석 · 조건 확인</Eyebrow>
      <Title>부족한 조건을 함께 정합니다</Title>
      <ol className="mt-3 grid grid-cols-3 gap-1.5 text-[11px]" aria-hidden="true">
        <li className="rounded-lg border border-[#3b82f6] bg-[#eff6ff] px-2 py-1.5">
          <b className="block text-[#1d4ed8]">01</b>추가 질문 답하기
        </li>
        <li className="rounded-lg border border-dashed border-[#cbd5e1] px-2 py-1.5 text-[#56667c]">
          <b className="block">02</b>조건 최종 확인
        </li>
        <li className="rounded-lg border border-dashed border-[#cbd5e1] px-2 py-1.5 text-[#56667c]">
          <b className="block">03</b>분석 시작
        </li>
      </ol>
      <div className="app-card mt-3 p-3">
        <p className="text-[12px] font-bold">투자 아이디어</p>
        <p className="mt-1.5 border-l-2 border-[#cbd5e1] pl-2.5 text-[12px] leading-relaxed">{scenario.idea}</p>
        <div className="mt-2 rounded-lg bg-[#f8fafc] p-2.5 text-[11.5px]">
          <p className="font-semibold text-[#56667c]">분석 모델의 이해</p>
          <p className="mt-0.5">{scenario.understanding}</p>
          <p className="mt-1.5 flex flex-wrap gap-1">
            {scenario.themes.map((t) => (
              <span key={t} className="rounded-full border border-[#e2e8f0] bg-white px-2 py-0.5 text-[11px] font-medium">
                {t}
              </span>
            ))}
          </p>
        </div>
      </div>
      <div className="app-card mt-3 p-3">
        <p className="flex flex-wrap items-center gap-1.5 text-[11.5px]">
          <b>{question.label}</b>
          <span className="pill text-[10.5px] text-warn">{question.tag}</span>
          <span className="text-[#56667c]">{question.field}</span>
        </p>
        <p className="mt-1.5 text-[14px] font-bold">{question.title}</p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-[#475569]">{question.why}</p>
        <div className="mt-2.5 grid grid-cols-3 gap-1.5" aria-hidden="true">
          {question.options.map((o) => (
            <span
              key={o}
              className={`num rounded-lg border px-2 py-1.5 text-center text-[12px] font-semibold ${
                o === question.picked ? "border-[#1d4ed8] bg-[#eff6ff] text-[#1d4ed8]" : "border-[#e2e8f0] text-[#334155]"
              }`}
            >
              {o}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ConfirmScreen() {
  return (
    <div className="scr px-4 py-5 text-[#0f172a]">
      <Eyebrow>새 분석 · 조건 확인</Eyebrow>
      <Title>이 조건으로 분석을 시작할까요?</Title>
      <p className="mt-1.5 text-[11.5px] leading-relaxed text-[#475569]">「분석 시작」을 누르기 전에는 분석이 실행되지 않으며, 아직 바꿀 수 있습니다.</p>
      <div className="app-card mt-3 overflow-hidden">
        <table className="w-full border-collapse text-left text-[11.5px]">
          <caption className="sr-only">예시 분석 조건</caption>
          <thead className="bg-[#f8fafc] text-[#56667c]">
            <tr>
              <th scope="col" className="px-3 py-1.5 font-semibold">항목</th>
              <th scope="col" className="px-3 py-1.5 font-semibold">이번 분석 값</th>
              <th scope="col" className="cf-src px-3 py-1.5 font-semibold">출처</th>
            </tr>
          </thead>
          <tbody>
            {conditions.map((c) => (
              <tr key={c.label} className={`border-t border-[#eef2f6] ${c.changed ? "bg-[#eff6ff]" : ""}`}>
                <th scope="row" className="px-3 py-1.5 font-medium text-[#334155]">{c.label}</th>
                <td className="num px-3 py-1.5 font-semibold">
                  {c.value}
                  {c.changed && <span className="ml-1.5 text-[10.5px] font-semibold text-[#1d4ed8]">변경</span>}
                </td>
                <td className="cf-src px-3 py-1.5 text-[#56667c]">{c.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2" aria-hidden="true">
        <span className="text-[11px] text-[#56667c]">시작한 뒤에는 조건을 바꿀 수 없습니다.</span>
        <span className="shrink-0 rounded-lg bg-[#1d4ed8] px-3.5 py-1.5 text-[12px] font-semibold text-white">분석 시작</span>
      </div>
    </div>
  );
}

export function RunScreen() {
  const total = runGroups.reduce((n, g) => n + g.detail, 0);
  return (
    <div className="scr px-4 py-5 text-[#0f172a]">
      <Eyebrow>분석 진행</Eyebrow>
      <Title data-run-title="">분석이 끝났습니다</Title>
      <p className="mt-1.5 text-[11.5px] leading-relaxed text-[#475569]">브라우저를 닫아도 서버 실행은 계속됩니다.</p>
      <div className="app-card mt-3 p-3">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[12.5px] font-bold">진행 단계</p>
          <p className="num text-[11px] text-[#56667c]">
            전체 {total}단계 중 <span data-run-count="">{total}</span>단계 완료
          </p>
        </div>
        <ol className="mt-2.5 flex flex-col gap-1.5" data-run="">
          {runGroups.map((g) => (
            <li key={g.name} className="run-row flex items-center gap-2.5 rounded-lg border border-[#e2e8f0] px-2.5 py-2 text-[12px]" data-state="done" data-detail={g.detail}>
              <span className="run-dot grid h-4 w-4 shrink-0 place-items-center rounded-full border" aria-hidden="true">
                <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6.2 5 8.5l4.5-5" />
                </svg>
              </span>
              <span className="min-w-0 flex-1 font-medium">{g.name}</span>
              <span className="run-state shrink-0 text-[11px]">완료</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-3 flex justify-end" aria-hidden="true">
        <span className="run-cta rounded-lg bg-[#1d4ed8] px-3.5 py-1.5 text-[12px] font-semibold text-white" data-run-cta="">
          리포트 보기
        </span>
      </div>
    </div>
  );
}
