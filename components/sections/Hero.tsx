import AppFrame from "../product/AppFrame";
import ReportOverview from "../product/ReportOverview";
import NotionLink from "../NotionLink";
import { site, startCta } from "@/lib/site";
import { getRelease } from "@/lib/release";
import { metrics, pct, pctPlain } from "@/lib/example";

export default async function Hero() {
  const release = await getRelease();
  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 lg:pb-24" aria-labelledby="hero-title">
      <div className="wrap grid items-start gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6 lg:pt-10">
          <h1 id="hero-title" className="h-display hero-h1">
            말로 적은 아이디어를
            <br /> 근거 있는 포트폴리오로
          </h1>
          <p className="lead mt-6 max-w-[34rem]">
            MyFinSight는 내 투자조건과 아이디어로 종목을 고르고 비중을 계산한 뒤, 과거 데이터로 성과와 위험을 확인한
            리포트를 만듭니다. 실제 매매는 하지 않습니다.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={startCta.href} className="btn btn-primary" {...(startCta.external ? { rel: "noopener" } : {})}>
              {startCta.label}
            </a>
            <a href="#tour" className="btn btn-secondary">
              리포트 둘러보기
            </a>
          </div>
          {!site.appUrl && (
            <p className="mt-4 text-[15px] text-ink-3">
              Windows, macOS, Linux용 {release.tag} {release.prerelease ? "시험판" : ""}
            </p>
          )}
          <NotionLink className="mt-4" />
          <dl className="mt-10 grid max-w-[34rem] grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 text-[15px]">
            <div>
              <dt className="text-ink-3">분석 대상</dt>
              <dd className="mt-0.5 font-semibold">
                <span className="whitespace-nowrap">S&amp;P 500,</span> <span className="whitespace-nowrap">NASDAQ-100,</span>{" "}
                <span className="whitespace-nowrap">KOSPI 200</span> 구성종목
              </dd>
            </div>
            <div>
              <dt className="text-ink-3">검증 방법</dt>
              <dd className="mt-0.5 font-semibold">거래 비용과 리밸런싱을 반영한 백테스트</dd>
            </div>
          </dl>
        </div>

        <div className="relative lg:col-span-6">
          <div className="art-ground relative h-[340px] overflow-hidden rounded-[18px] border border-line sm:h-[440px] lg:h-[600px]">
            <div className="hero-window absolute top-6 left-5 w-[560px] sm:top-10 sm:left-10 sm:w-[720px] lg:top-14 lg:left-12 lg:w-[880px]">
              <AppFrame title="분석 리포트" active="reports">
                <ReportOverview />
              </AppFrame>
            </div>
          </div>

          <aside
            className="hero-card absolute -bottom-6 left-4 hidden w-[300px] rounded-xl border border-line bg-white p-4 shadow-[0_18px_40px_-18px_rgb(15_27_45/0.35)] sm:block lg:-left-8"
            aria-label="예시 리포트의 조건 점검 결과"
          >
            <p className="flex items-center justify-between text-[13px] font-semibold">
              내 투자조건 점검
              <span className="rounded-[4px] bg-mist px-1.5 py-0.5 text-[11px] font-semibold text-ink-3">예시</span>
            </p>
            <p className="mt-3 flex items-center justify-between gap-3 text-[14px]">
              과거 최대낙폭
              <span className="num font-bold">{pct(metrics.mddStrategy)}</span>
            </p>
            <p className="mt-1 flex items-center justify-between gap-3 text-[14px]">
              손실 감내 수준
              <span className="num font-bold">{pctPlain(metrics.lossTolerance, 0)}</span>
            </p>
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-warn-50 px-3 py-2.5 text-[13px] leading-snug text-[#6b4103]">
              <span className="pill shrink-0 text-[11px] text-warn">주의</span>
              과거 하락 폭이 정해 둔 손실 감내 수준보다 컸습니다.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
