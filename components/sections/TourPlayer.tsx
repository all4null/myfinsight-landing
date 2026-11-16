"use client";

/**
 * 둘러보기 재생기.
 * - 앱은 페이지 전체를 어둡게 하고 스크롤을 잠그지만, 랜딩에서는 앱 창 안에서만 움직인다.
 *   리포트 내용을 translateY 로 옮겨 대상을 창 가운데로 가져오고, 스포트라이트(그림자 상자)와 말풍선이 같은 곡선으로 따라간다.
 * - 화면에 들어오면 자동 재생, 사용자가 조작하면 자동 재생을 끈다. 동작 줄이기 설정이면 자동 재생하지 않는다.
 * - 위치·이동은 매 단계 DOM 을 재서 ref 로 직접 스타일을 준다 (React 상태는 단계·재생 여부·말풍선 자리만).
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import AppFrame from "../product/AppFrame";

export type TourStep = { target: string; title: string; body: string };

const DWELL = 5200; // 한 단계에 머무는 시간 (ms)
const PAD = 6;
const INSIDE_MIN = 620; // 창 안에 말풍선을 둘 최소 폭

export default function TourPlayer({ steps, children }: { steps: TourStep[]; children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [inside, setInside] = useState(true);
  const [announce, setAnnounce] = useState(false);

  const vpRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const userStopped = useRef(false);
  const reduce = useRef(false);

  const last = index === steps.length - 1;

  /** 대상의 자리(내용 기준 좌표). 열린 도움말이 있으면 함께 감싼다 */
  const layout = useCallback(() => {
    const vp = vpRef.current, content = contentRef.current, spot = spotRef.current;
    if (!vp || !content || !spot) return;
    const el = content.querySelector<HTMLElement>(`[data-tour="${steps[index].target}"]`);
    if (!el) return;
    const c = content.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    let top = r.top, left = r.left, right = r.right, bottom = r.bottom;
    const tip = el.hasAttribute("data-open") ? el.querySelector(".tr-tip")?.getBoundingClientRect() : null;
    if (tip) {
      top = Math.min(top, tip.top);
      left = Math.min(left, tip.left);
      right = Math.max(right, tip.right);
      bottom = Math.max(bottom, tip.bottom);
    }
    const b = { top: top - c.top, left: left - c.left, width: right - left, height: bottom - top };

    const vh = vp.clientHeight;
    const vw = vp.clientWidth;
    const isInside = vw >= INSIDE_MIN;
    const pop = popRef.current;
    const popH = isInside && pop ? pop.offsetHeight + 16 : 0;
    const maxOff = Math.max(0, content.scrollHeight - vh);
    // 말풍선이 창 안에 있으면 대상과 말풍선이 함께 들어오게 대상을 조금 위로
    const off = Math.max(0, Math.min(maxOff, b.top - Math.max(20, (vh - b.height - popH) / 2)));
    content.style.transform = `translateY(${-off}px)`;

    const sTop = b.top - off;
    Object.assign(spot.style, {
      top: `${sTop - PAD}px`,
      left: `${b.left - PAD}px`,
      width: `${b.width + PAD * 2}px`,
      height: `${b.height + PAD * 2}px`,
      opacity: "1",
    });

    const slot = slotRef.current;
    if (isInside && slot && pop) {
      const w = Math.min(320, vw - 32);
      slot.style.width = `${w}px`;
      const ph = pop.offsetHeight;
      const below = sTop + b.height + PAD + 12;
      const above = sTop - PAD - 12 - ph;
      const fallback = vh - ph - 12;
      const y = below + ph <= vh - 12 ? below : above >= 12 ? above : fallback;
      let x = Math.min(Math.max(16, b.left), vw - w - 16);
      // 아래·위 모두 공간이 없으면 대상 옆으로 비킨다
      if (y === fallback && b.left + b.width + 12 + w <= vw - 12) x = b.left + b.width + 12;
      slot.style.transform = `translate(${x}px, ${Math.max(12, y)}px)`;
    }
  }, [index, steps]);

  // 단계가 바뀌면: 용어 설명 단계의 도움말을 열고 닫은 뒤 자리를 잰다
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    content.querySelectorAll("[data-open]").forEach((x) => x.removeAttribute("data-open"));
    if (steps[index].target === "term-help") content.querySelector(`[data-tour="term-help"]`)?.setAttribute("data-open", "");
    layout();
  }, [index, inside, steps, layout]);

  // 창 크기: 말풍선 자리(창 안/아래)를 정하고 다시 잰다
  useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const ro = new ResizeObserver(() => {
      setInside(vp.clientWidth >= INSIDE_MIN);
      requestAnimationFrame(layout);
    });
    ro.observe(vp);
    return () => ro.disconnect();
  }, [layout]);

  // 화면에 들어오면 자동 재생, 벗어나면 멈춤 (사용자가 멈췄거나 동작 줄이기면 다시 켜지 않는다)
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce.current) userStopped.current = true;
    const vp = vpRef.current;
    if (!vp) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userStopped.current) setPlaying(true);
        if (!entry.isIntersecting) setPlaying(false);
      },
      { threshold: 0.45 },
    );
    io.observe(vp);
    const onHide = () => document.hidden && setPlaying(false);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  // 자동 재생: 한 단계에 DWELL 만큼 머물고 다음으로, 마지막 단계에서 멈춘다
  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => {
      if (index === steps.length - 1) setPlaying(false);
      else {
        setAnnounce(false);
        setIndex((i) => i + 1);
      }
    }, DWELL);
    return () => window.clearTimeout(t);
  }, [playing, index, steps.length]);

  const userGo = (i: number) => {
    userStopped.current = true;
    setPlaying(false);
    setAnnounce(true);
    setIndex(Math.max(0, Math.min(steps.length - 1, i)));
  };
  const restart = () => {
    setAnnounce(true);
    setIndex(0);
    if (!reduce.current) {
      userStopped.current = false;
      setPlaying(true);
    }
  };
  const togglePlay = () => {
    if (playing) {
      userStopped.current = true;
      setPlaying(false);
    } else {
      userStopped.current = false;
      if (last) setIndex(0);
      setAnnounce(false);
      setPlaying(true);
    }
  };

  const step = steps[index];
  const popover = (
    <div ref={popRef} className={`tour-pop ${inside ? "" : "mt-4"}`} role="region" aria-label="둘러보기 안내">
      <div className="flex items-center justify-between gap-3">
        <p className="num text-[13px] font-bold text-brand">
          <span className="sr-only">단계 </span>
          {index + 1}/{steps.length}
        </p>
        <button type="button" className="tour-icon-btn" aria-pressed={!playing} onClick={togglePlay}>
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <rect x="3" y="2.5" width="3.4" height="11" rx="1" fill="currentColor" />
              <rect x="9.6" y="2.5" width="3.4" height="11" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 2.8v10.4a.8.8 0 0 0 1.2.7l8.4-5.2a.8.8 0 0 0 0-1.4L5.2 2.1A.8.8 0 0 0 4 2.8Z" fill="currentColor" />
            </svg>
          )}
          {playing ? "일시정지" : "자동 재생"}
        </button>
      </div>
      <div aria-live={announce ? "polite" : "off"}>
        <p className="mt-1.5 text-[17px] font-bold tracking-[-0.01em]">{step.title}</p>
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">{step.body}</p>
      </div>
      <div className="tour-progress mt-4" aria-hidden="true">
        <span key={`${index}-${playing}`} className={playing ? "tour-fill" : ""} />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <button type="button" className="tour-text-btn" onClick={restart}>
          처음부터
        </button>
        <div className="flex gap-2">
          <button type="button" className="tour-btn tour-btn--ghost" onClick={() => userGo(index - 1)} disabled={index === 0}>
            이전
          </button>
          <button type="button" className="tour-btn tour-btn--primary" onClick={() => userGo(last ? 0 : index + 1)}>
            {last ? "마치기" : "다음"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="mt-12"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          userGo(index + 1);
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          userGo(index - 1);
        }
      }}
    >
      <AppFrame title="분석 리포트 · 둘러보기" active="reports">
        <div ref={vpRef} className="tour-viewport relative overflow-hidden">
          <div ref={contentRef} className="tour-content">
            {children}
          </div>
          <div ref={spotRef} className="tour-spot" aria-hidden="true" />
          {inside && (
            <div ref={slotRef} className="tour-pop-slot">
              {popover}
            </div>
          )}
        </div>
      </AppFrame>

      {!inside && popover}

      <ol className="tour-steps mt-6">
        {steps.map((s, i) => (
          <li key={s.target}>
            <button type="button" className="tour-step" aria-current={i === index ? "step" : undefined} onClick={() => userGo(i)}>
              <span className="num tour-step-n">{i + 1}</span>
              <span>{s.title}</span>
              <span
                key={i === index ? `${index}-${playing}` : `idle-${i}`}
                className={`tour-step-bar ${i < index ? "is-done" : i === index && playing ? "tour-fill" : ""}`}
                aria-hidden="true"
              />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
