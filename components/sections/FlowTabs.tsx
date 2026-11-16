"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type FlowStep = { id: string; title: string; body: string };

const RUN_STEP_MS = 650;

/** "분석 진행" 화면의 다섯 묶음을 차례로 완료 표시한다 (사용자가 그 단계를 골랐을 때 한 번) */
function playRun(panel: HTMLElement, reduce: boolean): () => void {
  const rows = Array.from(panel.querySelectorAll<HTMLElement>("[data-run] > li"));
  const count = panel.querySelector<HTMLElement>("[data-run-count]");
  const title = panel.querySelector<HTMLElement>("[data-run-title]");
  const cta = panel.querySelector<HTMLElement>("[data-run-cta]");
  if (!rows.length || reduce) return () => {};
  const setRow = (r: HTMLElement, state: string, label: string) => {
    r.dataset.state = state;
    const s = r.querySelector(".run-state");
    if (s) s.textContent = label;
  };
  rows.forEach((r) => setRow(r, "wait", "대기 중"));
  if (count) count.textContent = "0";
  if (title) title.textContent = "분석을 실행하고 있습니다";
  if (cta) cta.dataset.hidden = "true";

  let i = 0;
  let done = 0;
  let timer = 0;
  const step = () => {
    if (i > 0) {
      const prev = rows[i - 1];
      setRow(prev, "done", "완료");
      done += Number(prev.dataset.detail ?? 1);
      if (count) count.textContent = String(done);
    }
    if (i < rows.length) {
      setRow(rows[i], "active", "진행 중");
      i += 1;
      timer = window.setTimeout(step, RUN_STEP_MS);
    } else {
      if (title) title.textContent = "분석이 끝났습니다";
      if (cta) cta.dataset.hidden = "false";
    }
  };
  timer = window.setTimeout(step, 250);
  return () => window.clearTimeout(timer);
}

export default function FlowTabs({ steps, panels }: { steps: FlowStep[]; panels: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const [replay, setReplay] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  // "분석과 검증" 탭을 고를 때마다 진행 연출을 다시 재생한다
  useEffect(() => {
    if (steps[active]?.id !== "run") return;
    const panel = panelRefs.current[active];
    if (!panel) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return playRun(panel, reduce);
  }, [active, replay, steps]);

  const select = (i: number, focus = false) => {
    setActive(i);
    setReplay((n) => n + 1);
    if (focus) tabRefs.current[i]?.focus();
  };

  const onClick = (i: number) => {
    select(i);
    // 좁은 화면에서는 화면이 탭 목록 아래에 있으므로 고른 화면으로 내려 준다
    if (!window.matchMedia("(min-width: 1024px)").matches) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      requestAnimationFrame(() => panelRefs.current[i]?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }));
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const move: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (e.key in move) {
      e.preventDefault();
      select((i + move[e.key] + steps.length) % steps.length, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      select(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      select(steps.length - 1, true);
    }
  };

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-4" role="tablist" aria-label="이용 단계" aria-orientation="vertical">
        {steps.map((s, i) => {
          const on = i === active;
          return (
            <button
              key={s.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${s.id}`}
              aria-controls={`panel-${s.id}`}
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              onClick={() => onClick(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className="flow-tab relative flex w-full gap-4 border-l-2 border-line py-4 pr-2 pl-5 text-left"
            >
              <span className={`num mt-0.5 text-[14px] font-semibold ${on ? "text-brand" : "text-ink-3"}`}>{i + 1}</span>
              <span className="min-w-0">
                <span className={`block text-[18px] font-semibold tracking-[-0.01em] ${on ? "text-ink" : "text-ink-2"}`}>{s.title}</span>
                {on && <span className="mt-1.5 block text-[15px] leading-relaxed text-ink-2">{s.body}</span>}
              </span>
            </button>
          );
        })}
      </div>

      <div className="lg:col-span-8">
        {steps.map((s, i) => (
          <div
            key={s.id}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            id={`panel-${s.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${s.id}`}
            className="flow-panel"
            tabIndex={0}
            hidden={i !== active}
          >
            {panels[i]}
          </div>
        ))}
      </div>
    </div>
  );
}
