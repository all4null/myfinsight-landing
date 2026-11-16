/**
 * 리포트 보는 법 둘러보기. 앱의 튜토리얼(Front/src/features/tutorial: Coachmark.tsx, steps.ts)을 랜딩 안으로 옮겼다.
 * 리포트 화면(TourReport)은 서버에서 그리고, TourPlayer(클라이언트)가 스포트라이트·말풍선·자동 재생을 맡는다.
 */
import TourReport from "../product/TourReport";
import TourPlayer, { type TourStep } from "./TourPlayer";

// 문구: 앱 tutorial/steps.ts (용어 설명 단계는 랜딩 화면에 맞게 다듬음)
const steps: TourStep[] = [
  {
    target: "verdict",
    title: "선택된 전략",
    body: "개요 맨 위 줄에 이번 분석이 고른 전략과 분석 기준일, 백테스트 기간이 있습니다. 선택 이유를 누르면 왜 이 전략을 골랐는지 볼 수 있습니다.",
  },
  {
    target: "past",
    title: "백테스트 핵심 성과",
    body: "그래프는 이 전략을 과거에 따랐다면 수익률이 어떻게 변했을지를 비교지수와 함께 보여 줍니다. 옆에는 연평균 수익률과 최대낙폭이 있습니다.",
  },
  {
    target: "term-help",
    title: "용어 설명",
    body: "용어 옆 ? 를 누르면 지금처럼 짧은 설명이 뜹니다. 위쪽 투자 용어 설명에서는 리포트에 나온 용어를 한곳에서 찾아볼 수 있습니다.",
  },
  { target: "composition", title: "종목 구성", body: "어떤 종목을 어떤 비중으로 담는지 한눈에 보여 줍니다. 막대 길이가 비중입니다." },
  { target: "allocation-list", title: "종목별 투자 금액", body: "종목마다 내 투자금에서 얼마를 넣는지(목표 배분액)를 보여 줍니다." },
  {
    target: "details",
    title: "자세한 분석",
    body: "선택 이유, 비중이 정해진 과정, 기업별 근거, 과거 성과와 내 조건 점검, 시장·뉴스 분석이 들어 있습니다. 눌러서 펼치고, 위쪽 탭을 눌러도 바로 열립니다.",
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
              리포트 보는 법, 화면을 따라가며 익히세요
            </h2>
          </div>
          <p className="lead lg:col-span-5">
            앱에 들어 있는 ‘리포트 보는 법 둘러보기’를 그대로 옮겼습니다. 리포트의 각 부분을 차례로 비추며 무엇을 읽으면 되는지
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
