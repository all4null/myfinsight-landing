/**
 * "리포트 보는 법 둘러보기"용 리포트 화면 재현 (앱 report/Dashboard.tsx 개요 탭 + tutorial/steps.ts 의 data-tour 대상).
 * data-tour 값은 앱과 같다: verdict, past, term-help, glossary, composition, allocation-list, details, paper-start.
 */
import LineChart from "./LineChart";
import Holdings from "./Holdings";
import { ReportHead, ReportTabs } from "./ReportOverview";
import { scenario, metrics, pct, pctPlain, won } from "@/lib/example";

const sections = ["종합 판단", "포트폴리오 구성", "기업별 근거", "시장·뉴스 분석", "과거 성과", "요청 내역", "주의 사항과 전제", "자료와 분석 조건"];

export default function TourReport() {
  return (
    <div className="tr px-4 pt-4 pb-6 text-[#0f172a]">
      <div className="tr-head">
        <ReportHead />
      </div>
      <ReportTabs glossary />

      <div className="app-card mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-3.5 py-2.5 text-[11.5px]" data-tour="verdict">
        <div>
          <p className="text-[#56667c]">선택된 전략</p>
          <p className="font-semibold">{scenario.strategy}</p>
        </div>
        <div>
          <p className="text-[#56667c]">분석 기준일</p>
          <p className="num">{scenario.asOf}</p>
        </div>
        <div className="tr-period">
          <p className="text-[#56667c]">백테스트 기간</p>
          <p className="num">{scenario.period}</p>
        </div>
        <span className="font-semibold text-[#1d4ed8]">선택 이유 ›</span>
      </div>

      <div className="app-card mt-3 overflow-hidden" data-tour="past">
        <p className="border-b border-[#e2e8f0] bg-[#f8fafc] px-3.5 py-2 text-[13px] font-bold">백테스트 핵심 성과</p>
        <div className="tr-perf grid gap-3 p-3.5">
          <div className="min-w-0">
            <p className="mb-2 text-[12px] font-semibold">누적 수익률</p>
            <LineChart height={130} />
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="rounded-[10px] border border-[#e2e8f0] p-3">
              <p className="text-[12px] font-semibold">연평균 수익률(CAGR)</p>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[11px] text-[#1d4ed8]">선택 전략</p>
                  <p className="num text-[18px] font-bold">{pct(metrics.cagrStrategy, 2)}</p>
                </div>
                <div className="border-l border-[#e2e8f0] pl-2.5">
                  <p className="text-[11px] text-[#56667c]">비교지수 · {scenario.benchmark}</p>
                  <p className="num text-[18px] font-bold">{pct(metrics.cagrBenchmark, 2)}</p>
                </div>
              </div>
            </div>
            <div className="relative rounded-[10px] border border-[#e2e8f0] p-3">
              <p className="flex items-center gap-1 text-[12px] font-semibold">
                최대낙폭(MDD)
                <span className="tr-help relative inline-flex" data-tour="term-help">
                  <span className="grid h-4 w-4 place-items-center rounded-full border border-[#94a3b8] text-[10px] leading-none text-[#56667c]" aria-hidden="true">
                    ?
                  </span>
                  <span className="tr-tip" role="note">
                    기간 중 가장 높았던 평가금액에서 가장 크게 떨어진 비율입니다. 같은 기간 비교지수와 함께 봅니다.
                  </span>
                </span>
              </p>
              <p className="num mt-1 text-[18px] font-bold">{pct(metrics.mddStrategy, 2)}</p>
              <p className="num text-[11px] text-[#56667c]">
                허용 손실 {pctPlain(metrics.lossTolerance, 0)} · {scenario.benchmark} {pct(metrics.mddBenchmark, 2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="app-card mt-3 px-3.5 py-3" data-tour="composition">
        <Holdings />
      </div>

      <div className="app-card mt-3 overflow-hidden" data-tour="allocation-list">
        <div className="flex items-baseline justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-3.5 py-2">
          <p className="text-[13px] font-bold">종목별 투자 금액</p>
          <p className="num text-[11px] text-[#56667c]">투자 기준금액 {won(scenario.budget)}</p>
        </div>
        <table className="w-full border-collapse text-left text-[11.5px]">
          <caption className="sr-only">예시 종목별 투자 금액</caption>
          <thead className="text-[#56667c]">
            <tr>
              <th scope="col" className="px-3.5 py-1.5 font-semibold">종목</th>
              <th scope="col" className="px-3.5 py-1.5 text-right font-semibold">비중</th>
              <th scope="col" className="px-3.5 py-1.5 text-right font-semibold">목표 배분액</th>
            </tr>
          </thead>
          <tbody>
            {scenario.holdings.map((h) => (
              <tr key={h.ticker} className="border-t border-[#eef2f6]">
                <th scope="row" className="px-3.5 py-1.5 font-medium">
                  {h.name} <span className="text-[#56667c]">{h.ticker}</span>
                </th>
                <td className="num px-3.5 py-1.5 text-right">{(h.weight * 100).toFixed(1)}%</td>
                <td className="num px-3.5 py-1.5 text-right font-semibold">{won(scenario.budget * h.weight)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="app-card mt-3 overflow-hidden" data-tour="details">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-3.5 py-2">
          <p className="text-[13px] font-bold">자세한 분석</p>
          <span className="text-[11.5px] font-semibold text-[#1d4ed8]" aria-hidden="true">
            모두 펼치기
          </span>
        </div>
        <ul className="text-[12px]">
          {sections.map((s) => (
            <li key={s} className="flex items-center justify-between border-t border-[#eef2f6] px-3.5 py-2 first:border-t-0">
              <span className="font-medium">{s}</span>
              <span className="text-[#94a3b8]" aria-hidden="true">
                펼치기
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
