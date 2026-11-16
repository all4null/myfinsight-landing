/**
 * 설치해서 써 보기. 근거: MyFinSight/howtouse.md (3절 준비, 4절 켜기, 6절 팀 DB 없이 연습), README.md 빠른 시작,
 * Front/package.json (Node 22, pnpm). 명령은 문서에 있는 것만 쓴다.
 */
import GithubMark from "../GithubMark";
import CopyButton from "./CopyButton";
import { site } from "@/lib/site";

const steps = [
  { title: "저장소 받기", body: "소스 코드를 내려받고 폴더로 들어갑니다.", code: `git clone ${site.repoUrl}.git\ncd MyFinSight` },
  {
    title: "분석 서비스 설치",
    body: "파이썬 가상환경을 만들고 필요한 꾸러미를 설치합니다.",
    code: `python -m venv .venv\nsource .venv/bin/activate   # Windows: .venv\\Scripts\\Activate.ps1\npip install -e ".[analysis,dev,postgres]"`,
  },
  {
    title: "설정 파일 만들기",
    body: "예시 파일을 복사해 팀 데이터베이스 주소와 OpenAI 키를 채우고, 종목 사전을 한 번 만듭니다(팀 DB가 있을 때). 키 없이 화면 흐름만 보려면 MYFINSIGHT_LLM=stub 으로 연습 모드를 켭니다.",
    code: `cp .env.example .env     # Windows: copy .env.example .env\npython backend/scripts/build_descriptor.py --universe ALL`,
  },
  { title: "화면 설치", body: "화면은 Node.js 22와 pnpm으로 설치합니다.", code: `cd Front\npnpm install\ncd ..` },
  {
    title: "세 프로그램 켜기",
    body: "터미널 세 개에서 서버, 일꾼, 화면을 켜고 브라우저에서 http://localhost:5173 을 엽니다.",
    code: `# 창 1 서버\nuvicorn backend.analysis.api.app:app --port 8001\n# 창 2 일꾼\npython -m backend.analysis.executor.worker\n# 창 3 화면\ncd Front && pnpm dev`,
  },
];

const needs = [
  { k: "Python", v: "3.11 이상" },
  { k: "Node.js", v: "22, pnpm 10" },
  { k: "데이터", v: "팀 데이터베이스 접속 정보 (없으면 연습용 가짜 데이터)" },
  { k: "AI 응답", v: "OpenAI API 키 (없으면 미리 만든 답을 쓰는 연습 모드)" },
];

export default function Start() {
  return (
    <section id="start" className="border-t border-line bg-mist py-20 md:py-28" aria-labelledby="start-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 id="start-title" className="h-section">
            내 컴퓨터에 설치해서 써 보기
          </h2>
          <p className="lead mt-5">
            MyFinSight는 소스 코드를 받아 직접 켜는 방식으로 쓸 수 있습니다. 분석 서버, 분석을 실제로 계산하는 일꾼, 브라우저
            화면 세 가지를 켜면 처음부터 끝까지 동작합니다.
          </p>
          {site.repoUrl && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={site.repoUrl} className="btn btn-primary" rel="noopener">
                <GithubMark size={18} />
                GitHub 저장소 열기
              </a>
            </div>
          )}
          <h3 className="h-sub mt-12">준비할 것</h3>
          <dl className="mt-4 flex flex-col">
            {needs.map((n) => (
              <div key={n.k} className="grid grid-cols-[6.5rem_1fr] gap-4 border-t border-line-strong py-3 text-[15px]">
                <dt className="font-semibold">{n.k}</dt>
                <dd className="text-ink-2">{n.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-[15px] leading-relaxed text-ink-2">
            팀 데이터베이스가 없다면 저장소의 <code className="rounded bg-white px-1.5 py-0.5 text-[14px]">howtouse.md</code> 6절 ‘팀 DB
            없이 연습해 보기’대로 가짜 데이터를 만들어 켤 수 있습니다. 실제 종목 이름만 빌린 만들어진 숫자입니다.
          </p>
        </div>

        <ol className="flex flex-col gap-5 lg:col-span-7">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-[14px] border border-line bg-white p-5 md:p-6">
              <div className="flex items-baseline gap-3">
                <span className="num text-[15px] font-semibold text-brand">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[17px] font-semibold tracking-[-0.01em]">{s.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{s.body}</p>
                </div>
              </div>
              <div className="code mt-4">
                <div className="code-bar">
                  <span className="text-[12px] text-[#9fb2cc]">터미널</span>
                  <CopyButton text={s.code} label={`${s.title} 명령 복사`} />
                </div>
                <pre tabIndex={0} aria-label={`${s.title} 명령`}>
                  <code>{s.code}</code>
                </pre>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
