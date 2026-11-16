/**
 * 리포트와 인용(근거) 소개. 근거: m5_backtest_report/report_check.py (인용 실존·기준일·보유 종목·금지 표현 검사),
 * Front report/SectionNav.tsx (섹션 이름), docs/03 9절 (출처 패널 항목).
 */
import CiteDemo from "./CiteDemo";

const sections = ["종합 판단", "포트폴리오 구성", "기업별 근거", "시장·뉴스 분석", "과거 성과", "요청 내역", "주의 사항과 전제", "자료와 분석 조건"];

export default function Report() {
  return (
    <section id="report" className="py-20 md:py-28" aria-labelledby="report-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 id="report-title" className="h-section">
            문장마다 출처를 확인할 수 있는 리포트
          </h2>
          <p className="lead mt-5">
            리포트는 결론만 말하지 않습니다. 어떤 기업을 왜 골랐는지, 비중이 어떻게 정해졌는지, 과거에 얼마나 떨어졌는지를
            문단으로 설명하고, 주요 사실 옆에 번호를 달아 원래 자료로 이어 줍니다.
          </p>
          <ul className="mt-8 flex flex-col gap-4 text-[16px] leading-relaxed">
            <li className="border-l-2 border-cite pl-4">
              <b className="font-semibold">근거가 없으면 내보내지 않습니다.</b>
              <span className="text-ink-2"> 저장된 근거 목록에 없는 인용, 분석 기준일 이후의 뉴스, 보유하지 않은 종목의 뉴스를 인용하면 리포트를 만들지 않습니다.</span>
            </li>
            <li className="border-l-2 border-cite pl-4">
              <b className="font-semibold">단정하는 표현을 막습니다.</b>
              <span className="text-ink-2"> “보장”, “확실한 수익”, “무위험” 같은 표현이 들어가면 리포트를 만들지 않습니다.</span>
            </li>
          </ul>
          <div className="mt-10">
            <h3 className="h-sub" id="report-parts">
              리포트에서 읽을 수 있는 내용
            </h3>
            <ol className="mt-3 grid grid-cols-2 gap-x-6 text-[15px]" aria-labelledby="report-parts">
              {sections.map((s, i) => (
                <li key={s} className="flex gap-3 border-t border-line py-2.5">
                  <span className="num w-4 text-ink-3">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="lg:col-span-7 lg:pt-2">
          <CiteDemo />
          <p className="mt-4 text-[14px] text-ink-3">본문의 번호를 누르면 오른쪽에 그 근거가 열립니다.</p>
        </div>
      </div>
    </section>
  );
}
