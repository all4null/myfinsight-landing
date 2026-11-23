/**
 * 내려받아 쓰기. 근거: MyFinSight/README.md "받아서 쓰기", packaging/RELEASE_NOTES.md (v0.1.1),
 * packaging/source-zip/README.md (스크립트·Docker·자료 폴더), docs/updates/2026-11-23_connection_setup.md (연결 설정),
 * Front/src/features/connect (연결 흐름: 팀 DB → 분석 모델 → 내 투자조건).
 * 판 번호와 파일은 lib/release.ts 의 getRelease() (.env → GitHub Releases → 저장된 값) 에서 온다.
 */
import CopyButton from "./CopyButton";
import DownloadList from "./DownloadList";
import { getRelease, otherWays } from "@/lib/release";

const needs = [
  { k: "팀 DB 주소", v: "가격·재무·공시·뉴스가 쌓인 MyFinSight 데이터베이스의 접속 주소입니다. 팀에서 받습니다." },
  { k: "OpenAI API 키", v: "아이디어 해석과 리포트 문장 작성에만 씁니다. 사용료는 키를 발급한 OpenAI 계정에 청구됩니다." },
  { k: "둘 다 없다면", v: "예시 데이터와 미리 만든 답으로 도는 연습 모드로 처음부터 끝까지 둘러볼 수 있습니다." },
];


export default async function Start() {
  const release = await getRelease();
  const { executables, sourceZip } = release;
  return (
    <section id="start" className="border-t border-line bg-mist py-20 md:py-28" aria-labelledby="start-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 id="start-title" className="h-section">
            내 컴퓨터에서 MyFinSight 시작하기
          </h2>
          <p className="lead mt-5">
            설치 과정 없이 파일 하나를 받아 켜면 브라우저에서 MyFinSight가 열립니다.
            <br />
            파이썬이나 Node.js를 따로 깔지 않아도 됩니다.
          </p>
          <h3 className="h-sub mt-12">준비할 것</h3>
          <dl className="mt-4 flex flex-col">
            {needs.map((n) => (
              <div key={n.k} className="grid gap-1 border-t border-line-strong py-3.5 text-[15px] sm:grid-cols-[7.5rem_1fr] sm:gap-4">
                <dt className="font-semibold">{n.k}</dt>
                <dd className="leading-relaxed text-ink-2">{n.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-7">
          <div className="dl-panel">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line px-5 py-4 md:px-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="text-[18px] font-bold tracking-[-0.01em]">MyFinSight {release.tag}</h3>
                {release.prerelease && <span className="pill text-[12px] text-warn">시험판</span>}
                {release.date && (
                  <span className="text-[14px] text-ink-3">
                    <time dateTime={release.date}>{release.dateLabel}</time> 공개
                  </span>
                )}
              </div>
              <a href={release.notesUrl} rel="noopener" className="dl-link text-[15px]">
                이 버전에서 바뀐 점
              </a>
            </div>

            <DownloadList items={executables} />

            <div className="border-t border-line px-5 py-5 md:px-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h3 className="text-[17px] font-semibold tracking-[-0.01em]">다른 방법으로 켜기</h3>
                <a href={sourceZip.url} rel="noopener" className="dl-link text-[15px]">
                  source.zip 다운로드
                </a>
              </div>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">
                두 방법 모두 <span className="dl-file">{sourceZip.name}</span> 하나를 받아 압축을 풀어 씁니다.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {otherWays.map((w) => (
                  <div key={w.id} className="flex min-w-0 flex-col rounded-[10px] border border-line bg-mist/60 p-4">
                    <div className="flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={w.icon} alt="" loading="lazy" width={w.iconSize[0]} height={w.iconSize[1]} />
                      <h4 className="text-[16px] font-semibold">{w.title}</h4>
                    </div>
                    <p className="mt-1 text-[13.5px] text-ink-3">필요한 것: {w.need}</p>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{w.body}</p>
                    <div className="mt-auto pt-4">
                      <div className="code code--wrap">
                        <div className="code-bar">
                          <span className="text-[12px] text-[#9fb2cc]">터미널</span>
                          <CopyButton text={w.code} label={`${w.title} 명령 복사`} />
                        </div>
                        <pre tabIndex={0} aria-label={`${w.title} 명령`}>
                          <code>{w.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="border-t border-line px-5 py-4 text-[14px] leading-relaxed text-ink-2 md:px-6">
              압축을 풀어 쓰는 폴더형 실행 파일(조금 더 빨리 켜짐)과 지난 버전은{" "}
              <a href={release.allUrl} rel="noopener" className="dl-link">
                Releases 페이지
              </a>
              에, 켜는 법과 문제 해결은{" "}
              <a href={release.guideUrl} rel="noopener" className="dl-link">
                배포판 안내
              </a>
              에 있습니다.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
