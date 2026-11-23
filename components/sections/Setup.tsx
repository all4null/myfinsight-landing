/**
 * 켜고 나서 할 일과 첫 화면(연결 설정). 근거: packaging/launcher.py (http://localhost:8765, 검은 창),
 * docs/updates/2026-11-23_connection_setup.md (값 찾는 순서·보관함·접속 확인·연습 모드), App.tsx (연결 → 내 투자조건 순서),
 * packaging/source-zip/README.md "자료가 쌓이는 곳".
 */
import AppFrame from "../product/AppFrame";
import ConnectScreen from "../product/ConnectScreen";
import { localUrl } from "@/lib/release";

const afterSteps = [
  {
    title: "받은 파일 켜기",
    body: `검은 창(터미널)이 함께 뜨고 브라우저가 ${localUrl} 로 열립니다. 끌 때는 그 검은 창을 닫습니다.`,
  },
  {
    title: "팀 DB와 분석 모델 연결",
    body: "처음 화면에서 팀 DB 주소와 OpenAI 키를 넣습니다. 저장하기 전에 실제로 접속해 보고, 값은 운영체제 보관함(Windows 자격 증명 관리자, macOS 키체인)에만 저장합니다. 「나중에 하기」를 누르면 연습 모드로 넘어갑니다.",
  },
  {
    title: "내 투자조건 정하기",
    body: "투자금, 투자기간, 투자성향, 손실 감내 수준을 대화로 정하면 홈에서 첫 아이디어를 적을 수 있습니다.",
  },
];

export default function Setup() {
  return (
    <section id="setup" className="py-20 md:py-28" aria-labelledby="setup-title">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-5">
          <h2 id="setup-title" className="h-section">
            켜고 나서 할 일
          </h2>
          <ol className="mt-8 flex flex-col">
            {afterSteps.map((s, i) => (
              <li key={s.title} className="flex gap-4 border-t border-line-strong py-4">
                <span className="num w-5 shrink-0 text-[15px] font-semibold text-brand">{i + 1}</span>
                <div className="min-w-0">
                  <h3 className="text-[17px] font-semibold tracking-[-0.01em]">{s.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
            리포트와 실행 기록은 프로그램 옆이 아니라 사용자 폴더(Windows는 %LOCALAPPDATA%\MyFinSight)에 쌓여, 새 버전으로
            바꿔도 그대로 남습니다.
          </p>
        </div>
        <div className="lg:col-span-7">
          <AppFrame title="연결 설정" sidebar={false}>
            <ConnectScreen />
          </AppFrame>
        </div>
      </div>
    </section>
  );
}
