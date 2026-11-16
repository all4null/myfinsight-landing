"use client";

/** 리포트 본문 + 출처 패널 예시. 번호를 누르면 패널의 근거가 바뀐다 (앱 리포트의 인용 → 출처 패널 동작). */
import { useState } from "react";
import { FrameBar } from "../product/AppFrame";

const sources = [
  {
    id: "1",
    kind: "공시",
    title: "실적 발표 (8-K, 항목 2.02)",
    org: "Applied Materials · SEC EDGAR",
    date: "접수일 2026-08-14",
    note: "공시는 사건이 있었다는 사실만 알려 줍니다. 내용 해석은 본문에서 따로 설명합니다.",
  },
  {
    id: "2",
    kind: "계산값",
    title: "60거래일 변동성",
    org: "가격 자료로 계산",
    date: "기준일 2026-10-30 전날까지",
    note: "역변동성 비중은 이 값의 역수로 정한 뒤, 종목당 상한 20%를 적용합니다.",
  },
];

export default function CiteDemo() {
  const [open, setOpen] = useState("1");
  const cite = (id: string) => (
    <button type="button" className="cite" aria-pressed={open === id} aria-controls="cite-panel" onClick={() => setOpen(id)}>
      [{id}]
    </button>
  );
  const s = sources.find((x) => x.id === open)!;

  return (
    <div className="frame">
      <FrameBar title="분석 리포트 · 포트폴리오 구성" />
      <div className="cite-body grid bg-white">
        <article className="p-5 text-[15px] leading-[1.85] text-[#0f172a] md:p-7">
          <p className="text-[12px] font-bold tracking-[0.06em] text-[#1d4ed8]">포트폴리오 구성</p>
          <p className="mt-1 text-[18px] font-bold tracking-[-0.02em]">비중이 정해진 과정</p>
          <p className="mt-3">
            여섯 종목 모두 반도체 장비와 메모리 업황에 함께 영향을 받기 때문에, 업종이 달라 보여도 위험이 자동으로 나뉘지는
            않습니다. 각 회사의 최근 실적 발표 공시 {cite("1")} 같은 사건은 기업별 근거에서 함께 확인할 수 있습니다.
          </p>
          <p className="mt-3">
            그래서 비중은 종목별 변동성의 역수로 먼저 나누고 {cite("2")}, 한 종목이 20%를 넘지 않도록 상한을 적용했습니다. 상한에
            걸린 ASML의 초과분은 나머지 종목에 나눠 담았습니다.
          </p>
        </article>
        <aside id="cite-panel" className="cite-panel border-t border-[#e2e8f0] bg-[#f8fafc] p-5 md:p-6" aria-live="polite" aria-label="선택한 근거">
          <p className="flex items-center gap-2 text-[12px]">
            <span className="num font-bold text-cite">[{s.id}]</span>
            <span className="pill text-[11px] text-ink-3">{s.kind}</span>
          </p>
          <p className="mt-2.5 text-[15px] font-semibold">{s.title}</p>
          <p className="mt-1 text-[13px] text-ink-3">{s.org}</p>
          <p className="num text-[13px] text-ink-3">{s.date}</p>
          <p className="mt-3 border-t border-[#e2e8f0] pt-3 text-[13px] leading-relaxed text-ink-2">{s.note}</p>
        </aside>
      </div>
    </div>
  );
}
