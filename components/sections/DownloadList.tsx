"use client";

/**
 * 운영체제별 실행 파일 목록. 서버에서는 세 줄을 똑같이 그리고, 브라우저에서 운영체제를 알아낸 뒤
 * 맞는 줄만 주 버튼과 「이 컴퓨터에 맞는 파일」 표시로 바꾼다. 이 섹션은 첫 화면 아래에 있어 표시가 붙으며 생기는 작은 이동은 보이지 않는다.
 * - 맥: Chrome 계열이면 CPU 종류까지 묻는다. 인텔 맥이면 맥 줄을 고르지 않고 파이썬 방법을 안내한다.
 * - 휴대폰·태블릿: 켤 수 없으므로 아무 줄도 고르지 않고 컴퓨터에서 받으라고 알린다.
 */
import { useEffect, useState } from "react";
import type { Platform } from "@/lib/release";

type Exe = {
  id: Platform;
  os: string;
  arch: string;
  icon: string;
  iconSize: [number, number];
  name: string;
  url: string;
  sizeMB: number | null;
  open: string;
  note: string;
};

type Detected = { platform: Platform | null; mobile: boolean; intelMac: boolean };

type UAData = { platform?: string; getHighEntropyValues?: (h: string[]) => Promise<{ architecture?: string }> };

function detect(): Detected {
  const ua = navigator.userAgent;
  const uad = (navigator as Navigator & { userAgentData?: UAData }).userAgentData;
  const touchMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1; // iPad 는 맥처럼 자신을 알린다
  if (/Android|iPhone|iPad|iPod/i.test(ua) || touchMac) return { platform: null, mobile: true, intelMac: false };
  const p = uad?.platform || navigator.platform || ua;
  if (/Win/i.test(p)) return { platform: "windows", mobile: false, intelMac: false };
  if (/Mac/i.test(p)) return { platform: "macos", mobile: false, intelMac: false };
  if (/Linux|X11/i.test(p)) return { platform: "linux", mobile: false, intelMac: false };
  return { platform: null, mobile: false, intelMac: false };
}

export default function DownloadList({ items }: { items: Exe[] }) {
  const [d, setD] = useState<Detected>({ platform: null, mobile: false, intelMac: false });

  useEffect(() => {
    const found = detect();
    setD(found);
    const uad = (navigator as Navigator & { userAgentData?: UAData }).userAgentData;
    if (found.platform === "macos" && uad?.getHighEntropyValues) {
      uad
        .getHighEntropyValues(["architecture"])
        .then((h) => {
          if (h.architecture === "x86") setD({ platform: null, mobile: false, intelMac: true });
        })
        .catch(() => {});
    }
  }, []);

  return (
    <>
      {(d.mobile || d.intelMac) && (
        <p role="status" className="dl-alert mx-5 mt-4 rounded-[8px] bg-brand-50 px-4 py-3 text-[15px] leading-relaxed text-ink-2 md:mx-6">
          {d.mobile
            ? "휴대폰과 태블릿에서는 켤 수 없습니다. 컴퓨터에서 이 페이지를 열어 다운받으세요."
            : "인텔 맥용 실행 파일은 없습니다. 아래 ‘파이썬으로 켜기’를 쓰세요."}
        </p>
      )}
      <ul className="mt-2">
        {items.map((x) => {
          const match = d.platform === x.id;
          return (
            <li key={x.id} className="dl-row" data-match={match ? "" : undefined}>
              <span className="dl-icon" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={x.icon} alt="" loading="lazy" width={x.iconSize[0]} height={x.iconSize[1]} />
              </span>
              <div className="dl-text min-w-0">
                <h4 className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[17px] font-semibold tracking-[-0.01em]">
                  <span>
                    {x.os} <span className="font-normal text-ink-3">{x.arch}</span>
                  </span>
                  {match && <span className="dl-match">이 컴퓨터에 맞는 파일</span>}
                </h4>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-2">
                  {x.open} {x.note}
                </p>
                <p className="mt-1.5 text-[13.5px] text-ink-3">
                  <span className="dl-file">{x.name}</span>
                  {x.sizeMB != null && <span className="num ml-2 whitespace-nowrap">약 {x.sizeMB}MB</span>}
                </p>
              </div>
              <a href={x.url} className={`dl-btn btn ${match ? "btn-primary" : "btn-secondary"}`} rel="noopener">
                {x.os}용 다운로드
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}
