import GithubMark from "../GithubMark";
import QrCode from "../QrCode";
import { site, startCta } from "@/lib/site";
import { getRelease } from "@/lib/release";

export default async function FinalCta() {
  const release = await getRelease();
  const qrs = [
    { url: new URL("/", site.url).href, logo: "site" as const, caption: "휴대폰으로 열기" },
    ...(site.repoUrl ? [{ url: site.repoUrl, logo: "github" as const, caption: "GitHub 소스 코드" }] : []),
  ];
  return (
    <section className="py-24 md:py-32" aria-labelledby="cta-title">
      <div className="wrap lg:flex lg:items-end lg:justify-between lg:gap-12">
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

        {/* 발표 화면이나 부스 모니터에 띄웠을 때 휴대폰으로 가져가는 용도. 휴대폰 화면에서는 찍을 수 없으니 넓은 화면에서만 */}
        <div className="hidden shrink-0 gap-5 lg:flex">
          {qrs.map((q) => (
            <div key={q.caption} className="flex flex-col items-center rounded-[14px] border border-line bg-white p-3">
              <QrCode url={q.url} logo={q.logo} label={`${q.caption} QR 코드: ${q.url}`} />
              <p className="mt-2 text-[14px] font-semibold text-ink-2">{q.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
