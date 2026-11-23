/**
 * 작동 방식: 실제 앱 순서 다섯 단계 (앱 FlowStepper 와 같은 이름). 화면(AppFrame + 각 Screen)은 서버에서 그려 FlowTabs 에 넘기고,
 * FlowTabs(클라이언트)는 탭 전환과 "분석 진행" 연출만 맡는다.
 */
import AppFrame from "../product/AppFrame";
import ReportOverview from "../product/ReportOverview";
import { IdeaScreen, ClarifyScreen, ConfirmScreen, RunScreen } from "../product/Screens";
import FlowTabs, { type FlowStep } from "./FlowTabs";

// 단계 이름은 앱 analysis/FlowStepper.tsx 의 PROCESS_STEPS 와 같다 (앱 화면 위쪽에도 같은 다섯 단계가 보인다)
const steps: FlowStep[] = [
  {
    id: "idea",
    title: "아이디어 적기",
    body: "홈의 「새 분석」 카드에 평소 말하듯 한두 문장을 적습니다. 예시 문장을 누르면 그 문장으로 바로 시작합니다. 저장해 둔 투자금, 투자기간, 투자성향, 손실 감내 수준은 다시 묻지 않고 그대로 씁니다.",
  },
  {
    id: "ask",
    title: "질문에 답하기",
    body: "결과가 달라지는 조건만, 같은 카드 안의 대화창에서 하나씩 묻습니다. 보기를 누르면 바로 답이 되고, 바꾸고 싶은 조건을 말로 보탤 수도 있습니다. 질문은 최대 5번이고, 답하지 않은 항목은 기본 투자조건을 씁니다.",
  },
  {
    id: "confirm",
    title: "조건 확인",
    body: "확정된 조건을 표로 보여 주고, 각 값이 기본 투자조건, 아이디어, 답변 중 어디에서 왔는지 표시합니다. 「이 조건으로 분석 실행」을 눌러야 분석이 실행됩니다.",
  },
  {
    id: "run",
    title: "분석·검증",
    body: "종목 선정, 비중 계산, 백테스트, 투자조건 점검, 리포트 작성까지 14단계를 차례로 실행합니다. 기다리는 동안 예시 리포트를 둘러볼 수 있고, 브라우저를 닫아도 분석은 계속됩니다.",
  },
  {
    id: "report",
    title: "리포트·모의투자",
    body: "과거 성과와 위험, 종목별 근거, 비중이 정해진 과정을 한 리포트에서 읽습니다. 마음에 들면 모의투자로, 아니면 조건 수정 요청으로 이어 갑니다.",
  },
];

const panels = [
  <AppFrame key="idea" title="홈 · 새 분석" active="home">
    <IdeaScreen />
  </AppFrame>,
  <AppFrame key="ask" title="홈 · 새 분석" active="home">
    <ClarifyScreen />
  </AppFrame>,
  <AppFrame key="confirm" title="조건 확인" active="home">
    <ConfirmScreen />
  </AppFrame>,
  <AppFrame key="run" title="분석 진행" active="home">
    <RunScreen />
  </AppFrame>,
  <AppFrame key="report" title="분석 리포트" active="reports">
    <ReportOverview />
  </AppFrame>,
];

export default function Flow() {
  return (
    <section id="how" className="border-t border-line bg-mist py-20 md:py-28" aria-labelledby="how-title">
      <div className="wrap">
        <div className="max-w-[44rem]">
          <h2 id="how-title" className="h-section">
            아이디어에서 리포트까지 다섯 단계
          </h2>
          <p className="lead mt-5">앱 화면 위쪽에도 이 다섯 단계가 표시되어, 지금 어디쯤인지 늘 알 수 있습니다. 단계를 고르면 그 단계의 화면을 볼 수 있습니다.</p>
        </div>
        <FlowTabs steps={steps} panels={panels} />
      </div>
    </section>
  );
}
