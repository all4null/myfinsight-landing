/**
 * 예시 리포트 둘러보기. 앱의 튜토리얼(Front/src/features/tutorial: Coachmark.tsx, steps.ts)을 랜딩 안으로 옮겼다.
 * 리포트 화면(TourReport)은 서버에서 그리고, TourPlayer(클라이언트)가 스포트라이트·말풍선·자동 재생을 맡는다.
 */
import TourReport from "../product/TourReport";
import TourPlayer, { type TourStep } from "./TourPlayer";

// 문구: 앱 tutorial/steps.ts (2026-11-20, 6단계). 앱에만 있는 안내(「둘러보기에서는 누르지 않아도 됩니다」)는 뺐다.
const steps: TourStep[] = [
  {
    target: "verdict",
    title: "선택된 전략",
    body: "개요 맨 위 「선택한 전략」에 이번 분석이 고른 전략과 그 설명이 있습니다. 「선택 이유 보기」를 누르면 고른 이유를 볼 수 있습니다.",
  },
  {
    target: "past",
    title: "과거 투자 결과",
    body: "맨 위 그래프는 이 전략을 과거에 따랐다면 수익률이 어떻게 변했을지를 비교지수와 함께 보여 줍니다. 그 아래에 전체 기간 수익률과 최대낙폭이 나란히 있고, 마지막 「결과 읽기」를 누르면 결과를 짧게 풀어 줍니다.",
  },
  {
    target: "term-help",
    title: "용어 설명",
    body: "용어 옆 「?」를 누르면 지금처럼 짧은 설명이 뜹니다. 위쪽 투자 용어 설명에서는 리포트에 나온 용어를 한곳에서 찾아볼 수 있습니다.",
  },
  {
    target: "allocation-list",
    title: "종목 구성과 투자 금액",
    body: "어떤 종목을 어떤 비중으로 담을지, 내 투자금에서 종목마다 얼마를 넣을지 보여 줍니다. 막대 길이가 비중입니다.",
  },
  {
    target: "details",
    title: "자세한 분석",
    body: "종합 판단, 기업별 근거, 포트폴리오 구성 등의 자세한 분석이 들어 있습니다. 눌러서 펼칠 수 있고, 위쪽 「모두 펼치기」로 모든 분석을 열 수 있습니다.",
  },
  {
    target: "paper-start",
    title: "모의투자로 지켜보기",
    body: "마음에 드는 리포트라면 모의투자 시작으로 실제 돈 없이 이 구성을 따라가 볼 수 있습니다.",
  },
];

export default function Tour() {
  return (
    <section id="tour" className="py-20 md:py-28" aria-labelledby="tour-title">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 id="tour-title" className="h-section">
              리포트 읽는 법, 화면을 따라가며 익히세요
            </h2>
          </div>
          <p className="lead lg:col-span-5">
            앱 홈의 「사용 안내」 메뉴에 있는 ‘예시 리포트 둘러보기’를 옮겼습니다. 리포트의 각 부분을 차례로 비추며 무엇을 읽으면 되는지
            알려 줍니다.
          </p>
        </div>
        <TourPlayer steps={steps}>
          <TourReport />
        </TourPlayer>
      </div>
    </section>
  );
}
