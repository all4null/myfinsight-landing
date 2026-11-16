import Logo from "./Logo";
import GithubMark from "./GithubMark";
import { nav, site } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy text-[#c9d6e8]">
      <div className="wrap grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-6">
          <Logo tone="light" />
          <p className="mt-5 max-w-[30rem] text-[15px] leading-relaxed">
            MyFinSight는 투자 아이디어를 과거 자료로 확인해 보는 분석 도구입니다. 투자 자문이나 매매 서비스를 제공하지
            않으며, 리포트의 과거 성과는 앞으로의 수익을 뜻하지 않습니다.
          </p>
        </div>
        <nav className="md:col-span-3 md:col-start-8" aria-label="바닥글 메뉴">
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="inline-flex min-h-11 items-center text-[15px] hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {site.repoUrl && (
          <div className="md:col-span-2">
            <a href={site.repoUrl} className="inline-flex min-h-11 items-center gap-2 text-[15px] hover:text-white" rel="noopener">
              <GithubMark size={16} />
              GitHub
            </a>
          </div>
        )}
      </div>
      <div className="border-t border-white/10">
        <p className="wrap py-6 text-[13px] text-[#8fa3bf]">© {year} MyFinSight</p>
      </div>
    </footer>
  );
}
