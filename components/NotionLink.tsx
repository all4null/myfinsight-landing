import { site } from "@/lib/site";

/** 사용자 가이드(Notion) 버튼. 첫 화면과 마지막 CTA 의 배포판 안내 아래에 둔다. 주소가 없으면 그리지 않는다. */
export default function NotionLink({ className = "" }: { className?: string }) {
  if (!site.notionUrl) return null;
  return (
    <a href={site.notionUrl} rel="noopener" className={`btn btn-secondary w-full sm:w-auto ${className}`}>
      <DocIcon />
      사용자 가이드
      <span className="text-[13px] font-medium text-ink-3">Notion</span>
    </a>
  );
}

/** 문서 아이콘 (장식용. 옆에 글자가 있다) */
function DocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  );
}
