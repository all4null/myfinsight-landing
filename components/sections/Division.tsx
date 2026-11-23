/**
 * AI 와 코드의 역할 분담. 근거: backend/analysis/prompts (LLM 9종), m3_selection, m4_portfolio, m5_backtest_report.
 * 고정된 단계형 파이프라인이며 에이전트·RAG 구조가 아니다.
 */
const ai = [
  "말로 적은 아이디어를 투자 테마와 업종으로 해석",
  "결과가 달라지는 조건을 골라 질문",
  "후보 기업이 아이디어에 맞는지 분류",
  "공시를 주 근거로, 뉴스를 보조로 읽고 종목별 의견의 방향과 강도를 판단",
  "리포트 문장과 기업별 근거 설명 작성",
  "조건 수정 요청을 바뀌는 항목으로 정리",
];
const code = [
  "후보 검색과 지표 순위: 저PER, 퀄리티(ROE), 모멘텀, 저변동성, 고배당",
  "비중 계산: 동일비중, 시가총액비중, 역변동성, 최소분산과 종목·업종 상한",
  "공시·뉴스 의견을 근거가 분명할수록 크게 반영하는 비중 조정 (Black-Litterman, 종목마다 조정 폭 한도)",
  "거래 비용과 리밸런싱을 반영한 백테스트, 수익·위험 지표 계산",
  "내 투자조건 충족 여부 점검",
  "리포트 인용이 실제 저장된 자료를 가리키는지 대조",
];

function Column({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-navy-2 p-7 md:p-9">
      <h3 className="h-sub">{title}</h3>
      <ul className="mt-6 flex flex-col">
        {items.map((t) => (
          <li key={t} className="border-t border-white/12 py-3.5 text-[16px] leading-relaxed text-[#dfe7f2]">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Division() {
  return (
    <section className="bg-navy py-20 text-white md:py-28" aria-labelledby="division-title">
      <div className="wrap">
        <div className="max-w-[46rem]">
          <h2 id="division-title" className="h-section">
            AI는 해석하고, 숫자는 코드가 계산합니다
          </h2>
          <p className="mt-5 text-[18px] leading-[1.75] text-[#c9d6e8]">
            언어 모델은 말로 된 아이디어를 이해하고 설명을 쓰는 데에만 씁니다. 종목 순위, 비중, 수익률과 위험 지표는 정해진
            계산 규칙으로 구합니다. 그래서 같은 조건이면 언제 다시 봐도 같은 숫자가 나옵니다.
          </p>
        </div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-[14px] bg-white/15 md:grid-cols-2">
          <Column title="AI가 맡는 일" items={ai} />
          <Column title="코드가 맡는 일" items={code} />
        </div>
        <p className="mt-8 max-w-[46rem] text-[15px] leading-relaxed text-[#a9bbd3]">
          같은 요청은 저장해 둔 AI 응답을 다시 써서 같은 결과를 냅니다. 비중을 정할 때는 그 시점 전날까지의 자료만 쓰고 그날
          종가로 샀다고 계산해, 미래 자료가 섞이지 않게 막습니다.
        </p>
      </div>
    </section>
  );
}
