const faqs = [
  { q: "실제로 주식을 사고파나요?", a: "아니요. MyFinSight는 분석 리포트와 모의투자만 제공합니다. 주문을 내거나 증권 계좌에 연결하지 않습니다." },
  {
    q: "리포트의 수익률을 기대해도 되나요?",
    a: "리포트의 성과는 과거 자료로 계산한 결과이며 앞으로의 수익을 뜻하지 않습니다. 과거 구간에도 지금의 구성종목을 쓰기 때문에 실제보다 좋게 나올 수 있고, 리포트에 이 한계를 함께 적습니다.",
  },
  {
    q: "어떤 종목을 분석할 수 있나요?",
    a: "미국 S&P 500과 NASDAQ-100, 한국 KOSPI 200의 구성종목입니다. 두 시장을 섞으면 한국 비교지수와 원·달러 환율을 함께 반영합니다.",
  },
  {
    q: "AI가 종목을 골라 주나요?",
    a: "AI는 아이디어를 해석하고 후보 기업이 그 아이디어에 맞는지 분류합니다. 순위와 비중은 PER, ROE, 변동성 같은 지표와 정해진 계산 규칙으로 정합니다.",
  },
  {
    q: "투자조건을 바꾸면 예전 리포트도 바뀌나요?",
    a: "바뀌지 않습니다. 투자조건을 수정하면 새 버전으로 저장되고, 이미 만든 리포트는 당시 조건과 결과를 그대로 유지합니다.",
  },
  {
    q: "결과가 마음에 들지 않으면 어떻게 하나요?",
    a: "리포트에서 조건 수정을 말로 요청하면 바뀌는 조건을 확인한 뒤 수정안을 새로 분석합니다. 원래 리포트는 남아 있고, 두 안을 나란히 비교할 수 있습니다.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function Faq() {
  return (
    <section id="faq" className="border-t border-line bg-mist py-20 md:py-28" aria-labelledby="faq-title">
      <div className="wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="faq-title" className="h-section">
            자주 묻는 질문
          </h2>
        </div>
        <div className="lg:col-span-8">
          {faqs.map((f) => (
            <details key={f.q} className="faq group border-t border-line-strong last:border-b">
              <summary className="flex min-h-14 list-none items-center justify-between gap-6 py-5 text-[18px] font-semibold">
                {f.q}
                <svg
                  className="shrink-0 text-ink-3 transition-transform duration-200 group-open:rotate-45"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M10 4v12M4 10h12" />
                </svg>
              </summary>
              <p className="max-w-[42rem] pb-6 text-[16px] leading-relaxed text-ink-2">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
