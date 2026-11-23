/**
 * "작동 방식" 단계별 앱 화면 재현 (2026-11-18 홈 개편 이후의 앱). 문구는 앱 Front/src 의 실제 문구를 따른다.
 * - FlowStepper: analysis/FlowStepper.tsx (1~5 단계. 폭이 760px 보다 좁은 자리에서는 지금 단계만 이름을 보인다)
 * - IdeaScreen: home/HomeScreen.tsx (「새 분석」 카드, 「사용 안내」, 예시 문장, 「분석 시작하기」)
 * - ClarifyScreen: home/RequestChat.tsx · chatParts.tsx (새 분석의 보충 질문은 홈 카드 안 대화창에서 하나씩)
 * - ConfirmScreen: analysis/ConfirmScreen.tsx (「이 조건으로 분석 실행」)
 * - RunScreen: run/RunScreen.tsx · steps.ts (5묶음 14단계). data-run 목록의 진행 연출은 FlowTabs 가 맡는다.
 * 색은 앱 토큰(globals.css 의 --color-app-*)으로 쓴다: 회색 바탕 위 테두리 없는 흰 카드.
 */
import Glyph from "./Glyph";
import { scenario, question, conditions, runGroups, exampleIdeas } from "@/lib/example";

const STEPS = ["아이디어 적기", "질문에 답하기", "조건 확인", "분석·검증", "리포트·모의투자"];

export function FlowStepper({ current }: { current: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div className="rounded-[14px] bg-white px-3.5 py-2.5" role="img" aria-label={`분석 진행 5단계 중 ${current}단계, ${STEPS[current - 1]}`}>
      <ol className="flex items-center gap-2" aria-hidden="true">
        {STEPS.map((s, i) => {
          const n = i + 1;
          const done = n < current;
          const now = n === current;
          return (
            <li key={s} className={`flex items-center gap-2 ${now ? "shrink-0" : "min-w-0"} ${n < STEPS.length ? "flex-1" : ""}`}>
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10.5px] font-bold ${
                  done || now ? "bg-[#1d4ed8] text-white" : "bg-app-sunken text-app-sub"
                } ${now ? "ring-[3px] ring-app-tint" : ""}`}
              >
                {done ? <Glyph name="check" size={11} stroke={3.2} /> : n}
              </span>
              {now && <span className="text-[12px] font-bold whitespace-nowrap text-app-main">{s}</span>}
              {n < STEPS.length && <span className={`h-0.5 min-w-2 flex-1 rounded-full ${done ? "bg-[#1d4ed8]" : "bg-app-line"}`} />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** 「새 분석」 카드 머리: 제목 + 오른쪽 작은 버튼들 */
function CardHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-app-line px-4 py-2.5">
      <p className="text-[14px] font-bold text-app-main">새 분석</p>
      <span className="flex items-center gap-1 text-[11.5px] font-medium text-app-sub" aria-hidden="true">
        {children}
      </span>
    </div>
  );
}

export function IdeaScreen() {
  return (
    <div className="scr2 flex flex-col gap-2.5 bg-app-canvas p-3 text-app-main sm:p-4">
      <FlowStepper current={1} />
      <section className="rounded-[18px] bg-white">
        <CardHead>
          <span className="inline-flex items-center gap-1 rounded-[8px] px-1.5 py-1">
            <Glyph name="help" size={13} />
            사용 안내
          </span>
        </CardHead>
        <div className="flex flex-col items-center px-4 pt-5 pb-3 text-center">
          <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-app-sunken text-[#1d4ed8]">
            <Glyph name="chat" size={20} />
          </span>
          <p className="mt-3 text-[16px] font-bold tracking-[-0.02em]">투자 아이디어를 적어 주세요</p>
          <p className="mt-1 max-w-[300px] text-[12px] leading-relaxed text-app-body">
            내 투자조건에 맞는 종목과 비중을 고르고, 과거 성과와 위험을 리포트로 보여드립니다.
          </p>
          <ul className="mt-3 flex flex-col items-center gap-1.5" aria-label="예시 문장">
            {exampleIdeas.map((t) => (
              <li key={t} className="rounded-[10px] bg-app-sunken px-3 py-1.5 text-[11.5px]">
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-3 pt-1">
          <div className="rounded-[14px] bg-app-sunken p-2.5">
            <p className="min-h-[40px] px-1 text-[12.5px] leading-relaxed">
              {scenario.idea}
              <span className="caret" aria-hidden="true" />
            </p>
            <div className="mt-1.5 flex items-center justify-between gap-2" aria-hidden="true">
              <span className="inline-flex items-center gap-1 px-1.5 py-1 text-[12px] font-semibold">
                <Glyph name="sliders" size={13} />
                상세 조건
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-[10px] bg-[#1d4ed8] py-1.5 pr-2 pl-3 text-[12px] font-semibold text-white">
                분석 시작하기
                <Glyph name="chevron" size={13} />
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/** 분석 모델 쪽 말풍선: 회색 면, 왼쪽 위 모서리만 직각 (chatParts BotSays) */
function BotSays({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <li className="flex">
      <div className={`min-w-0 rounded-[12px] rounded-tl-none bg-app-bubble px-3 py-2.5 text-[12px] leading-relaxed ${wide ? "flex-1" : "max-w-[85%]"}`}>
        {children}
      </div>
    </li>
  );
}

/** 내 쪽 말풍선: 파란 면, 오른쪽 위 모서리만 직각 (chatParts ISay) */
function ISay({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex justify-end">
      <p className="max-w-[80%] rounded-[12px] rounded-tr-none bg-[#1d4ed8] px-3 py-2 text-[12px] leading-relaxed text-white">{children}</p>
    </li>
  );
}

export function ClarifyScreen() {
  return (
    <div className="scr2 flex flex-col gap-2.5 bg-app-canvas p-3 text-app-main sm:p-4">
      <FlowStepper current={2} />
      <section className="rounded-[18px] bg-white">
        <CardHead>
          <span className="inline-flex items-center gap-1 px-1.5 py-1">
            <Glyph name="sliders" size={13} />
            조건 바꾸기
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-1">
            <Glyph name="x" size={13} />
            취소
          </span>
        </CardHead>
        <ol className="flex flex-col gap-2.5 px-3 pt-3.5 pb-3" aria-label="분석 모델과의 대화 (예시)">
          <ISay>{scenario.idea}</ISay>
          <BotSays>
            <p className="text-[11px] font-semibold text-app-sub">이렇게 이해했어요</p>
            <p className="mt-0.5">{scenario.understanding}</p>
            <p className="mt-1.5 flex flex-wrap gap-1">
              {scenario.themes.map((t) => (
                <span key={t} className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium">
                  {t}
                </span>
              ))}
            </p>
          </BotSays>
          <BotSays wide>
            <p className="text-[11px] text-app-sub">{question.meta}</p>
            <p className="mt-0.5 text-[13.5px] font-bold">{question.title}</p>
            <p className="mt-0.5 text-[11.5px] text-app-body">{question.why}</p>
            <div className="mt-2 flex flex-col gap-1.5" aria-hidden="true">
              {question.options.map((o) => (
                <span key={o.label} className="rounded-[10px] bg-white px-3 py-1.5">
                  <span className="block text-[12px] font-semibold">{o.label}</span>
                  <span className="block text-[10.5px] text-app-sub">바뀌는 조건: {o.patch}</span>
                </span>
              ))}
            </div>
            <p className="mt-1.5 text-[11.5px] text-app-sub underline underline-offset-2" aria-hidden="true">
              답하지 않음 (기본값 사용)
            </p>
          </BotSays>
        </ol>
        <div className="p-3 pt-0" aria-hidden="true">
          <div className="flex items-end justify-between gap-2 rounded-[14px] bg-app-sunken p-2.5">
            <p className="min-w-0 px-1 text-[11.5px] leading-relaxed text-app-sub">바꾸고 싶은 조건을 말로 적어 주세요. 예: 배당주 위주로 / 종목은 8개만</p>
            <span className="shrink-0 rounded-[10px] bg-[#1d4ed8] px-3 py-1.5 text-[12px] font-semibold text-white">말로 보태기</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export function ConfirmScreen() {
  return (
    <div className="scr2 flex flex-col gap-2.5 bg-app-canvas p-3 text-app-main sm:p-4">
      <FlowStepper current={3} />
      <section className="rounded-[18px] bg-white px-4 py-4">
        <p className="text-[11px] font-bold text-[#1d4ed8]">새 분석 · 조건 확인</p>
        <p className="mt-1 text-[17px] leading-snug font-bold tracking-[-0.02em]">이 조건으로 분석을 시작할까요?</p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-app-body">
          기본 투자조건에 답변과 변경을 반영한 최종 조건입니다. 「이 조건으로 분석 실행」을 누르기 전에는 분석이 실행되지 않으며, 아직
          바꿀 수 있습니다.
        </p>
        <div className="mt-3 overflow-hidden rounded-[12px] bg-app-sunken">
          <table className="w-full border-collapse text-left text-[11.5px]">
            <caption className="sr-only">예시 분석 조건</caption>
            <thead className="text-app-sub">
              <tr>
                <th scope="col" className="px-3 py-1.5 font-semibold">항목</th>
                <th scope="col" className="px-3 py-1.5 font-semibold">이번 분석 값</th>
                <th scope="col" className="cf-src px-3 py-1.5 font-semibold">출처</th>
              </tr>
            </thead>
            <tbody>
              {conditions.map((c) => (
                <tr key={c.label} className={`border-t border-white ${c.changed ? "bg-app-tint" : ""}`}>
                  <th scope="row" className="px-3 py-1.5 font-medium text-app-body">{c.label}</th>
                  <td className="num px-3 py-1.5 font-semibold">
                    {c.value}
                    {c.changed && <span className="ml-1.5 text-[10.5px] font-semibold text-[#1d4ed8]">변경</span>}
                  </td>
                  <td className="cf-src px-3 py-1.5 text-app-sub">{c.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="flex items-center justify-between gap-2 rounded-[14px] bg-white px-4 py-2.5" aria-hidden="true">
        <span className="text-[11px] text-app-sub">시작한 뒤에는 조건을 바꿀 수 없습니다.</span>
        <span className="shrink-0 rounded-[10px] bg-[#1d4ed8] px-3.5 py-1.5 text-[12px] font-semibold text-white">이 조건으로 분석 실행</span>
      </div>
    </div>
  );
}

export function RunScreen() {
  const total = runGroups.reduce((n, g) => n + g.detail, 0);
  return (
    <div className="scr2 flex flex-col gap-2.5 bg-app-canvas p-3 text-app-main sm:p-4">
      <FlowStepper current={4} />
      <section className="rounded-[18px] bg-white px-4 py-4">
        <p className="text-[11px] font-bold text-[#1d4ed8]">분석 진행</p>
        <p className="mt-1 text-[17px] leading-snug font-bold tracking-[-0.02em]" data-run-title="">
          분석이 끝났습니다
        </p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-app-body">브라우저를 닫아도 서버 실행은 계속됩니다.</p>
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <p className="text-[12.5px] font-bold">진행 단계</p>
          <p className="num text-[11px] text-app-sub">
            전체 {total}단계 중 <span data-run-count="">{total}</span>단계 완료
          </p>
        </div>
        <ol className="mt-2 flex flex-col gap-1.5" data-run="">
          {runGroups.map((g) => (
            <li key={g.name} className="run-row flex items-center gap-2.5 rounded-[10px] border border-app-line px-2.5 py-2 text-[12px]" data-state="done" data-detail={g.detail}>
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
        <div className="mt-3 flex justify-end" aria-hidden="true">
          <span className="run-cta rounded-[10px] bg-[#1d4ed8] px-3.5 py-1.5 text-[12px] font-semibold text-white" data-run-cta="">
            리포트 보기
          </span>
        </div>
      </section>
    </div>
  );
}
