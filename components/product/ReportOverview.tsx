/**
 * 리포트 상세의 "개요" 탭 재현 (앱 report/Dashboard.tsx, 2026-11-20 기준).
 * 위에서 아래로: 선택한 전략 → 과거 투자 결과(그래프 → 전체 기간 수익률 · 최대낙폭 → 결과 읽기) → 종목 구성과 투자 금액.
 * 판정(추천·주의)과 조건 점검은 앱처럼 첫 화면에 두지 않는다 (아래 자세한 분석의 「종합 판단」·「주의 사항과 전제」).
 * 카드 셋은 히어로·작동 방식·둘러보기(TourReport)가 함께 쓴다. tour 를 주면 둘러보기 대상(data-tour)과 용어 도움말이 붙는다.
 */
import LineChart from "./LineChart";
import { scenario, metrics, pct, pctPlain, won } from "@/lib/example";

const tabs = ["개요", "종목 선정", "과거 성과", "시장·뉴스", "요청·주의사항·자료"];

export function ReportHead() {
  return (
    <div className="ro-head flex flex-col gap-3">
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-[#1d4ed8]">분석 리포트</p>
        <p className="mt-1 text-[19px] leading-snug font-bold tracking-[-0.02em]">{scenario.name}</p>
      </div>
      <div className="flex gap-1.5" aria-hidden="true">
        <span className="rounded-lg bg-[#1d4ed8] px-3 py-1.5 text-[12px] font-semibold text-white" data-tour="paper-start">
          모의투자 시작
        </span>
        <span className="rounded-lg border border-[#cbd5e1] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#1d4ed8]">조건 수정 요청</span>
      </div>
    </div>
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

/** 요약 카드 틀 (앱 ResultCard): 제목 줄 오른쪽에 「… 자세히 보기」 */
function Card({ title, more, tour, children }: { title: string; more: string; tour?: string; children: React.ReactNode }) {
  return (
    <div className="app-card mt-3 overflow-hidden" data-tour={tour}>
      <div className="flex items-center justify-between gap-3 border-b border-[#e2e8f0] px-3.5 py-2">
        <p className="text-[13px] font-bold">{title}</p>
        <span className="shrink-0 text-[11.5px] font-semibold text-[#1d4ed8]" aria-hidden="true">
          {more} ›
        </span>
      </div>
      <div className="px-3.5 py-3">{children}</div>
    </div>
  );
}

const Help = () => (
  <span className="grid h-4 w-4 place-items-center rounded-full border border-[#94a3b8] text-[10px] leading-none text-[#56667c]" aria-hidden="true">
    ?
  </span>
);

export function VerdictCard({ tour = false }: { tour?: boolean }) {
  return (
    <Card title="선택한 전략" more="선택 이유 보기" tour={tour ? "verdict" : undefined}>
      <p className="flex items-center gap-1.5 text-[16px] font-bold">
        {scenario.strategy}
        <Help />
      </p>
      <p className="mt-0.5 text-[12px] leading-relaxed text-[#475569]">{scenario.strategyShort}</p>
    </Card>
  );
}

/** 지표 칸 하나: 선택 전략 | 비교지수 */
function Kpi({ title, desc, mine, other, mineSub, otherSub, help }: { title: string; desc?: string; mine: string; other: string; mineSub?: string; otherSub?: string; help?: React.ReactNode }) {
  return (
    <div className="rounded-[10px] border border-[#e2e8f0] bg-white p-3">
      <p className="flex items-center gap-1 text-[12px] font-semibold">
        {title}
        {help}
      </p>
      {desc && <p className="text-[10.5px] text-[#56667c]">{desc}</p>}
      <div className="mt-1.5 grid grid-cols-2 gap-2">
        <div>
          <p className="text-[11px] font-semibold text-[#1d4ed8]">선택 전략</p>
          <p className="num text-[18px] font-bold tracking-[-0.02em]">{mine}</p>
          {mineSub && <p className="num text-[10.5px] text-[#56667c]">{mineSub}</p>}
        </div>
        <div className="border-l border-[#e2e8f0] pl-2.5">
          <p className="text-[11px] text-[#56667c]">비교지수 · {scenario.benchmark}</p>
          <p className="num text-[18px] font-bold tracking-[-0.02em]">{other}</p>
          {otherSub && <p className="num text-[10.5px] text-[#56667c]">{otherSub}</p>}
        </div>
      </div>
    </div>
  );
}

export function PastCard({ tour = false, chartHeight = 140 }: { tour?: boolean; chartHeight?: number }) {
  const mddHelp = tour ? (
    <span className="tr-help relative inline-flex" data-tour="term-help">
      <Help />
      <span className="tr-tip" role="note">
        기간 중 가장 높았던 평가금액에서 가장 크게 떨어진 비율입니다. 같은 기간 비교지수와 함께 봅니다.
      </span>
    </span>
  ) : (
    <Help />
  );
  return (
    <Card title="과거 투자 결과" more="과거 성과 자세히 보기" tour={tour ? "past" : undefined}>
      <p className="mb-2 flex items-baseline justify-between gap-2 text-[12px]">
        <span className="font-semibold">누적 수익률</span>
        <span className="text-[10.5px] text-[#56667c]">시작일 0% 기준</span>
      </p>
      <LineChart height={chartHeight} />
      <div className="ro-kpis mt-3 grid gap-2.5">
        <Kpi
          title="전체 기간 수익률"
          desc={`${scenario.tradingDays}거래일 기준`}
          mine={pct(metrics.totalStrategy)}
          other={pct(metrics.totalBenchmark)}
          mineSub={`연평균(CAGR) ${pct(metrics.cagrStrategy)}`}
          otherSub={`연평균(CAGR) ${pct(metrics.cagrBenchmark)}`}
        />
        <Kpi
          title="최대낙폭"
          desc="가장 높았던 때와 비교해 가장 많이 떨어졌던 비율"
          mine={pct(metrics.mddStrategy)}
          other={pct(metrics.mddBenchmark)}
          help={mddHelp}
        />
      </div>
      <p className="mt-2.5 flex items-center justify-between rounded-[8px] bg-[#f8fafc] px-3 py-2 text-[12px]" aria-hidden="true">
        <span className="font-semibold">결과 읽기</span>
        <span className="text-[11px] text-[#56667c]">3가지 ⌄</span>
      </p>
      <p className="sr-only">
        이 하락폭은 내가 정한 허용 손실 {pctPlain(metrics.lossTolerance, 0)}보다 컸습니다.
      </p>
    </Card>
  );
}

export function AllocationCard({ tour = false }: { tour?: boolean }) {
  const max = Math.max(...scenario.holdings.map((h) => h.weight));
  return (
    <Card title="종목 구성과 투자 금액" more="구성 자세히 보기" tour={tour ? "allocation-list" : undefined}>
      <p className="text-[10.5px] text-[#56667c]">{scenario.asOf} 기준</p>
      <p className="mt-1.5 text-[11px] font-semibold text-[#56667c]">투자 기준금액</p>
      <p className="num text-[15px] font-bold">{won(scenario.budget)}</p>
      <table className="mt-2 w-full border-collapse text-left text-[11.5px]">
        <caption className="sr-only">예시 종목별 투자 비중과 목표 배분액</caption>
        <thead className="text-[10.5px] text-[#56667c]">
          <tr className="border-b border-[#e2e8f0]">
            <th scope="col" className="py-1.5 pr-2 font-semibold">종목</th>
            <th scope="col" className="py-1.5 pr-2 text-right font-semibold">투자 비중</th>
            <th scope="col" className="ro-bar-col py-1.5 font-semibold">
              <span className="sr-only">비중 막대</span>
            </th>
            <th scope="col" className="py-1.5 text-right font-semibold">목표 배분액</th>
          </tr>
        </thead>
        <tbody>
          {scenario.holdings.map((h) => (
            <tr key={h.ticker} className="border-t border-[#eef2f6] first:border-t-0">
              <th scope="row" className="py-1.5 pr-2 font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: h.color }} aria-hidden="true" />
                  {h.name}
                </span>
              </th>
              <td className="num py-1.5 pr-2 text-right">{(h.weight * 100).toFixed(1)}%</td>
              <td className="ro-bar-col w-[30%] py-1.5 pr-3" aria-hidden="true">
                <span className="block h-1.5 rounded-full" style={{ width: `${(h.weight / max) * 100}%`, background: h.color }} />
              </td>
              <td className="num py-1.5 text-right font-semibold">{won(scenario.budget * h.weight)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export default function ReportOverview({ showAllocation = true, chartHeight = 140 }: { showAllocation?: boolean; chartHeight?: number }) {
  return (
    <div className="ro px-4 pt-4 pb-5 text-[#0f172a]">
      <ReportHead />
      <ReportTabs />
      <VerdictCard />
      <PastCard chartHeight={chartHeight} />
      {showAllocation && <AllocationCard />}
    </div>
  );
}
