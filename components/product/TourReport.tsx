/**
 * "예시 리포트 둘러보기"용 리포트 화면 재현 (앱 report/Dashboard.tsx 개요 탭 + tutorial/steps.ts 의 data-tour 대상).
 * data-tour 값은 앱과 같다: verdict, past, term-help, glossary, allocation-list, details, paper-start.
 * (2026-11-20 앱에서 「종목 구성」과 「종목별 투자 금액」이 한 카드 「종목 구성과 투자 금액」이 되어 composition 대상은 없다.)
 */
import { AllocationCard, PastCard, ReportHead, ReportTabs, VerdictCard } from "./ReportOverview";

const sections = ["종합 판단", "포트폴리오 구성", "기업별 근거", "시장·뉴스 분석", "과거 성과", "요청 내역", "주의 사항과 전제", "자료와 분석 조건"];

export default function TourReport() {
  return (
    <div className="tr px-4 pt-4 pb-6 text-[#0f172a]">
      <div className="tr-head">
        <ReportHead />
      </div>
      <ReportTabs glossary />
      <VerdictCard tour />
      <PastCard tour chartHeight={130} />
      <AllocationCard tour />

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
              <span className="text-[#56667c]" aria-hidden="true">
                펼치기
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
