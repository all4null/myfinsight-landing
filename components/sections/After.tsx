/**
 * 리포트 이후: 모의투자와 수정안 비교.
 * 근거: m6_tracking/paper.py (가상 자본, 매일 평가, 리밸런싱, 자료 없으면 지연 표시), worker.py (한가할 때 1시간마다 갱신),
 * m1_request/revision.py + compare.py (말로 수정 요청 → 조건 확인 → 같은 평가 기간이면 성과 비교, 장단점 문장은 코드가 작성).
 * 화면 문구는 Front paper/PaperScreen.tsx.
 */
import { FrameBar } from "../product/AppFrame";
import { scenario } from "@/lib/example";

const paperMetrics = [
  { k: "현재 평가액", v: "₩10,412,300" },
  { k: "운용 수익률 (납입 제외)", v: "+4.1%" },
  { k: "비교지수 대비 차이", v: "+0.8%p" },
  { k: "다음 리밸런싱", v: "2027-01-29" },
];

const diff = [
  { k: "종목당 최대 비중", a: "20%", b: "15%" },
  { k: "보유 종목 수", a: "6", b: "8" },
  { k: "과거 최대낙폭", a: "−24.4%", b: "−21.9%" },
  { k: "누적 수익률", a: "+36.8%", b: "+31.2%" },
];

export default function After() {
  return (
    <section id="after" className="py-20 md:py-28" aria-labelledby="after-title">
      <div className="wrap">
        <div className="max-w-[46rem]">
          <h2 id="after-title" className="h-section">
            리포트를 받은 다음에도 이어집니다
          </h2>
          <p className="lead mt-5">
            고른 전략을 실제 돈 없이 따라가 보거나, 말로 조건을 바꿔 원래 안과 나란히 비교할 수 있습니다. 원래 리포트는 그대로
            남습니다.
          </p>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-10">
          <article>
            <h3 className="h-sub">모의투자로 지켜보기</h3>
            <p className="mt-3 max-w-[34rem] text-[16px] leading-relaxed text-ink-2">
              리포트의 전략을 가상 자본으로 따라갑니다. 매일 평가하고 정해진 주기에 리밸런싱합니다. 자료가 늦게 들어오면 값을
              지어내지 않고 갱신이 늦어졌다고 표시합니다.
            </p>
            <div className="frame mt-6">
              <FrameBar title="모의투자" />
              <div className="p-4 md:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[15px] font-bold">{scenario.name}</p>
                  <span className="flex gap-1.5">
                    <span className="pill text-[11px] text-[#1d4ed8]">운용 중</span>
                    <span className="pill text-[11px] text-ok">자료 정상</span>
                  </span>
                </div>
                <p className="mt-3 text-[12.5px] font-bold text-[#0f172a]">핵심 성과</p>
                <dl className="mt-2 grid grid-cols-2 gap-2">
                  {paperMetrics.map((m) => (
                    <div key={m.k} className="app-card px-3 py-2.5">
                      <dt className="text-[11.5px] text-[#56667c]">{m.k}</dt>
                      <dd className="num mt-0.5 text-[16px] font-bold tracking-[-0.01em]">{m.v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-3 flex justify-end gap-1.5" aria-hidden="true">
                  <span className="rounded-lg border border-[#cbd5e1] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#334155]">모의투자 중지</span>
                  <span className="rounded-lg bg-[#1d4ed8] px-3 py-1.5 text-[12px] font-semibold text-white">최신 자료로 갱신</span>
                </div>
              </div>
            </div>
          </article>

          <article>
            <h3 className="h-sub">말로 고쳐서 비교하기</h3>
            <p className="mt-3 max-w-[34rem] text-[16px] leading-relaxed text-ink-2">
              “한 종목은 15%까지만 담아 줘”처럼 요청하면 바뀌는 조건을 정리해 보여 주고, 확인한 뒤에 수정안을 새로 분석합니다.
              평가 기간이 같으면 두 안의 성과와 위험을 나란히 놓습니다.
            </p>
            <div className="frame mt-6">
              <FrameBar title="전략 비교" />
              <div className="p-4 md:p-5">
                <div className="app-card overflow-hidden">
                  <table className="w-full border-collapse text-left text-[13px]">
                    <caption className="sr-only">원안과 수정안 비교 (예시)</caption>
                    <thead className="bg-[#f8fafc] text-[12px] text-[#56667c]">
                      <tr>
                        <th scope="col" className="px-3 py-2 font-semibold">항목</th>
                        <th scope="col" className="px-3 py-2 text-right font-semibold">원안</th>
                        <th scope="col" className="px-3 py-2 text-right font-semibold text-[#1d4ed8]">수정안</th>
                      </tr>
                    </thead>
                    <tbody>
                      {diff.map((d) => (
                        <tr key={d.k} className="border-t border-[#eef2f6]">
                          <th scope="row" className="px-3 py-2.5 font-medium text-[#334155]">{d.k}</th>
                          <td className="num px-3 py-2.5 text-right">{d.a}</td>
                          <td className="num px-3 py-2.5 text-right font-semibold">{d.b}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-[12.5px] leading-relaxed text-[#475569]">비교 결과에는 수정안이 나아진 점과 불리해진 점을 함께 적습니다.</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
