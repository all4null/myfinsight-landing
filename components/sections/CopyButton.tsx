"use client";

import { useEffect, useState } from "react";

/** 코드 블록 복사 버튼. 결과는 버튼 글자와 화면 낭독기용 알림으로 알려 준다. */
export default function CopyButton({ text, label }: { text: string; label: string }) {
  const [state, setState] = useState<"idle" | "done" | "fail">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const t = window.setTimeout(() => setState("idle"), 2000);
    return () => window.clearTimeout(t);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("done");
    } catch {
      setState("fail");
    }
  };

  return (
    <>
      <button type="button" className="copy-btn" data-done={state === "done" ? "" : undefined} aria-label={label} onClick={copy}>
        {state === "done" ? "복사됨" : state === "fail" ? "직접 선택" : "복사"}
      </button>
      <span className="sr-only" aria-live="polite">
        {state === "done" ? "명령을 복사했습니다." : state === "fail" ? "복사하지 못했습니다. 명령을 직접 선택해 복사해 주세요." : ""}
      </span>
    </>
  );
}
