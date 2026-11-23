import GithubMark from "../GithubMark";
import { site, startCta } from "@/lib/site";
import { getRelease } from "@/lib/release";

export default async function FinalCta() {
  const release = await getRelease();
  return (
    <section className="py-24 md:py-32" aria-labelledby="cta-title">
      <div className="wrap">
        <div className="max-w-[48rem]">
          <h2 id="cta-title" className="h-section">
            다음 투자 아이디어,
            <br /> 사기 전에 먼저 확인해 보세요
          </h2>
          <p className="lead mt-6 max-w-[38rem]">
            한두 문장의 아이디어와 기본 투자조건이면 시작할 수 있습니다. 분석은 조건을 확인하고 「이 조건으로 분석 실행」을 누른 뒤에만 실행됩니다.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={startCta.href} className="btn btn-primary" {...(startCta.external ? { rel: "noopener" } : {})}>
              {startCta.label}
            </a>
            {site.repoUrl ? (
              <a href={site.repoUrl} rel="noopener" className="btn btn-secondary">
                <GithubMark size={18} />
                GitHub에서 보기
              </a>
            ) : (
              <a href="#faq" className="btn btn-secondary">
                자주 묻는 질문 보기
              </a>
            )}
          </div>
          {!site.appUrl && (
            <p className="mt-5 text-[15px] text-ink-3">
              Windows, macOS, Linux용 {release.tag} {release.prerelease ? "시험판" : ""}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
