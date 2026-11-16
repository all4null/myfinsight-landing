/** 리포트 상세의 "개요" 탭 재현 (앱 report/Dashboard.tsx 구조: 전략 정보 띠 → 백테스트 핵심 성과 → 종목 구성) */
import LineChart from "./LineChart";
import Holdings from "./Holdings";
import { scenario, metrics, pct, pctPlain } from "@/lib/example";

const tabs = ["개요", "종목 선정", "과거 성과", "시장·뉴스", "요청·주의·자료"];

export function ReportHead() {
  return (
    <>
      <div className="ro-head flex flex-col gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold tracking-[0.08em] text-[#1d4ed8]">분석 리포트</p>
          <p className="mt-1 text-[19px] leading-snug font-bold tracking-[-0.02em]">{scenario.name}</p>
        </div>
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="rounded-lg bg-[#1d4ed8] px-3 py-1.5 text-[12px] font-semibold text-white" data-tour="paper-start">
            모의투자 시작
          </span>
          <span className="rounded-lg border border-[#cbd5e1] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#1d4ed8]">조건 수정 요청</span>
        </div>
      </div>
    </>
  );
}

export function ReportTabs({ glossary = false }: { glossary?: boolean }) {
  return (
    <div className="mt-3 flex items-end justify-between gap-3 border-b border-[#e2e8f0]">
      <div className="flex gap-4 overflow-hidden text-[12.5px] whitespace-nowrap" aria-hidden="true">
        {tabs.map((t, i) => (
          <span key={t} className={`pb-2 ${i === 0 ? "border-b-2 border-[#1d4ed8] font-semibold text-[#1d4ed8]" : "text-[#475569]"}`}>
            {t}
          </span>
        ))}
      </div>
      {glossary && (
        <span
          className="tr-glossary mb-1.5 hidden shrink-0 rounded-lg border border-[#e2e8f0] bg-white px-2.5 py-1 text-[11.5px] font-semibold text-[#334155]"
          data-tour="glossary"
        >
          투자 용어 설명
        </span>
      )}
    </div>
  );
}

export default function ReportOverview({ showHoldings = true }: { showHoldings?: boolean }) {
  return (
    <div className="ro px-4 pt-4 pb-5 text-[#0f172a]">
      <ReportHead />
      <ReportTabs />

      <div className="app-card ro-strip mt-3 grid grid-cols-2 gap-x-4 gap-y-2 px-3.5 py-2.5 text-[11.5px]">
        <div>
          <p className="text-[#56667c]">선택된 전략</p>
          <p className="font-semibold">{scenario.strategy}</p>
        </div>
        <div>
          <p className="text-[#56667c]">판단</p>
          <p>
            <span className="pill text-[11px] text-warn">{scenario.verdict}</span>
          </p>
        </div>
        <div>
          <p className="text-[#56667c]">분석 기준일</p>
          <p className="num">{scenario.asOf}</p>
        </div>
        <div>
          <p className="text-[#56667c]">백테스트 기간</p>
          <p className="num">{scenario.period}</p>
        </div>
      </div>

      <div className="app-card mt-3 overflow-hidden">
        <p className="border-b border-[#e2e8f0] bg-[#f8fafc] px-3.5 py-2 text-[13px] font-bold">백테스트 핵심 성과</p>
        <div className="ro-perf grid gap-3 p-3.5">
          <div className="min-w-0">
            <p className="mb-2 text-[12px] font-semibold">누적 수익률</p>
            <LineChart height={150} />
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="rounded-[10px] border border-[#e2e8f0] bg-white p-3">
              <p className="text-[12px] font-semibold">연평균 수익률(CAGR)</p>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[11px] text-[#1d4ed8]">선택 전략</p>
                  <p className="num text-[19px] font-bold tracking-[-0.02em]">{pct(metrics.cagrStrategy, 2)}</p>
                </div>
                <div className="border-l border-[#e2e8f0] pl-2.5">
                  <p className="text-[11px] text-[#56667c]">비교지수 · {scenario.benchmark}</p>
                  <p className="num text-[19px] font-bold tracking-[-0.02em]">{pct(metrics.cagrBenchmark, 2)}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[10px] border border-[#e2e8f0] bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[12px] font-semibold">최대낙폭(MDD)</p>
                <span className="pill text-[11px] text-warn">주의</span>
              </div>
              <p className="num mt-1 text-[19px] font-bold tracking-[-0.02em]">{pct(metrics.mddStrategy, 2)}</p>
              <p className="num text-[11px] text-[#56667c]">
                허용 손실 {pctPlain(metrics.lossTolerance, 0)}보다 큽니다 · {scenario.benchmark} {pct(metrics.mddBenchmark, 2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showHoldings && (
        <div className="app-card mt-3 px-3.5 py-3">
          <Holdings />
        </div>
      )}
    </div>
  );
}
