"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import GithubMark from "./GithubMark";
import { nav, site, startCta } from "@/lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    wide.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("scroll", onScroll);
      wide.removeEventListener("change", onWide);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const ext = startCta.external ? { rel: "noopener" } : {};

  return (
    <header
      id="top"
      className={`sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-[border-color] duration-200 ${
        scrolled ? "border-line" : "border-transparent"
      }`}
    >
      <div className="wrap flex h-[68px] items-center justify-between gap-6">
        <a href="#top" className="-m-1 rounded-md p-1" aria-label="MyFinSight 처음으로">
          <Logo />
        </a>

        <nav aria-label="주요 메뉴" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-md px-3 py-2 text-[15px] font-medium text-ink-2 transition-colors hover:bg-mist hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {site.repoUrl && (
            <a
              href={site.repoUrl}
              rel="noopener"
              className="hidden h-[42px] items-center gap-2 rounded-md px-3 text-[15px] font-medium text-ink-2 transition-colors hover:bg-mist hover:text-ink sm:inline-flex"
            >
              <GithubMark size={18} />
              GitHub
            </a>
          )}
          <a href={startCta.href} className="btn btn-primary hidden min-h-[42px] px-4 text-[15px] sm:inline-flex" {...ext}>
            {startCta.label}
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink hover:bg-mist lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "메뉴 닫기" : "메뉴 열기"}</span>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="border-t border-line bg-white lg:hidden" hidden={!open}>
        <nav aria-label="모바일 메뉴" className="wrap py-4">
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="flex min-h-12 items-center border-b border-line text-[17px] font-medium" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={startCta.href} className="btn btn-primary mt-5 w-full" onClick={() => setOpen(false)} {...ext}>
            {startCta.label}
          </a>
          {site.repoUrl && (
            <a href={site.repoUrl} rel="noopener" className="btn btn-secondary mt-3 w-full">
              <GithubMark size={18} />
              GitHub 저장소
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
