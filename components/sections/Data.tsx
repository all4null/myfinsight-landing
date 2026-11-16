/**
 * 데이터 범위. 근거: MyFinSight/README.md "DB 데이터 현황 (2026-10-17 기준)" 표.
 * 분석 중에는 외부 검색을 하지 않고 팀 DB만 읽는다 (README 원칙, m2_data).
 */
const rows = [
  { k: "가격", us: "1999년 10월부터 · Alpaca, yfinance (Tiingo로 표본 검증)", kr: "1999년 10월부터 · KIS, yfinance" },
  { k: "재무제표", us: "2005년부터 · SEC EDGAR", kr: "2004년부터 · DART, KIS" },
  { k: "공시", us: "2000년부터 · SEC EDGAR", kr: "2000년부터 · DART" },
  { k: "뉴스", us: "2009년부터 · Benzinga, Google 뉴스, NewsAPI 등", kr: "2005년부터 · Google 뉴스, 네이버" },
  { k: "환율", us: "원·달러 환율 1999년 10월부터 · yfinance, FRED", kr: "" },
];

export default function Data() {
  return (
    <section className="border-t border-line py-20 md:py-28" aria-labelledby="data-title">
      <div className="wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="data-title" className="h-section">
            분석에 쓰는 자료
          </h2>
          <p className="lead mt-5">
            가격, 재무, 공시, 뉴스를 매일 모아 출처끼리 대조한 뒤 데이터베이스에 쌓습니다. 분석하는 동안에는 인터넷을 검색하지
            않고 이 자료만 읽습니다.
          </p>
          <p className="mt-6 text-[14px] text-ink-3">2026년 10월 기준</p>
        </div>
        <div className="lg:col-span-8">
          <div className="data-table rounded-[12px] border border-line">
            <table className="w-full border-collapse text-left text-[15px]">
              <caption className="sr-only">시장별 자료 종류와 수집 시작 시점, 출처</caption>
              <thead className="bg-mist text-[14px] text-ink-3">
                <tr>
                  <th scope="col" className="w-28 px-5 py-3 font-semibold">자료</th>
                  <th scope="col" className="px-5 py-3 font-semibold">미국 · S&amp;P 500, NASDAQ-100</th>
                  <th scope="col" className="px-5 py-3 font-semibold">한국 · KOSPI 200</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.k} className="border-t border-line align-top">
                    <th scope="row" className="px-5 py-4 font-semibold">{r.k}</th>
                    <td className="px-5 py-4 leading-relaxed text-ink-2" colSpan={r.kr ? 1 : 2} data-label={r.kr ? "미국" : "공통"}>
                      {r.us}
                    </td>
                    {r.kr && (
                      <td className="px-5 py-4 leading-relaxed text-ink-2" data-label="한국">
                        {r.kr}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
