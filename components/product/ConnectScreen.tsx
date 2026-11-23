"use client";

/**
 * 처음 켰을 때 뜨는 「연결 설정」 흐름을 장면 순서대로 재생한다.
 * 문구·순서는 앱 Front/src/features/connect/ConnectFlow.tsx, parts.tsx 와 같다:
 *   팀 DB 주소 입력 → 연결하기 → 「연결을 확인하는 중…」 → 「팀 DB에 연결했습니다」(가린 주소 · 최신 거래일 · 시장별 자료 시작일) → 다음
 *   → OpenAI API 키 입력 → 연결하기 → 확인 중 → 「OpenAI에 연결했습니다」 → 「내 투자조건 설정으로」.
 * 입력칸은 앱처럼 가려진 칸(password)이라 점으로 찍히고, 주소는 다 넣으면 풀어서(서버·포트·데이터베이스·계정) 보여 준다.
 * 값은 앱 목업과 같은 예시(db.example.com, reader, …a3F9)이고, 날짜·사용료는 앱 목업과 서버 기본값(0.1달러)을 따른다.
 *
 * - 네 화면을 한 칸에 겹쳐 두어 높이가 가장 큰 화면에 고정된다 (장면이 바뀌어도 페이지가 밀리지 않는다).
 * - 화면에 보일 때만 재생하고, 멈춤·다시 보기 버튼을 둔다. 동작 줄이기 설정이면 자동 재생하지 않는다.
 * - 화면 재현은 장식이라 읽기 도구에는 감추고, 같은 과정을 한 문장으로 알린다.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Glyph, { type GlyphName } from "./Glyph";

const ACCENT = "#1d4ed8";
const SUCCESS = "#047857";

const scenes = [
  { id: "db-empty", ms: 1300 },
  { id: "db-type", ms: 1700 },
  { id: "db-filled", ms: 1100 },
  { id: "db-press", ms: 320 },
  { id: "db-test", ms: 1700 },
  { id: "db-done", ms: 2000 },
  { id: "db-next", ms: 320 },
  { id: "llm-empty", ms: 1200 },
  { id: "llm-type", ms: 1300 },
  { id: "llm-filled", ms: 1000 },
  { id: "llm-press", ms: 320 },
  { id: "llm-test", ms: 1600 },
  { id: "llm-done", ms: 1900 },
  { id: "llm-next", ms: 320 },
  { id: "end", ms: 1800 },
] as const;
type SceneId = (typeof scenes)[number]["id"];

const DB_LEN = 54; // postgresql://reader:…@db.example.com:5432/myfinsight 쯤의 길이
const KEY_LEN = 40;
const DB_MASKED = "postgresql://reader:••••••••@db.example.com:5432/myfinsight";
const KEY_MASKED = "sk-••••••••••••a3F9";

const dbNotes: { icon: GlyphName; title: string; text: string }[] = [
  { icon: "monitor", title: "이 컴퓨터에만 저장", text: "주소는 Windows 자격 증명 관리자에 저장되고 연결 설정에서 지울 수 있습니다." },
  { icon: "book", title: "가격·재무·뉴스 조회", text: "앱은 팀 DB에서 자료를 읽기만 하고 고치지 않습니다." },
  { icon: "file", title: "팀 DB와 따로 보관", text: "리포트와 실행 기록은 이 컴퓨터에 저장됩니다." },
];
const llmNotes: { icon: GlyphName; title: string; text: string }[] = [
  { icon: "monitor", title: "이 컴퓨터에만 저장", text: "키는 Windows 자격 증명 관리자에 저장되고 연결 설정에서 지울 수 있습니다." },
  { icon: "send", title: "OpenAI에만 사용", text: "키는 아이디어 해석과 리포트 작성에 OpenAI 모델을 부를 때만 씁니다." },
  { icon: "card", title: "분석 1회 약 0.1달러", text: "사용료는 키를 발급한 OpenAI 계정에 청구됩니다." },
];

type StopState = "now" | "done" | "next";

/* ───────── 작은 조각 (앱 parts.tsx 축소 재현) ───────── */

function OpenAiMark({ size = 16 }: { size?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/icons/openai.svg" alt="" width={size} height={size} className="shrink-0" />;
}

function Track({ db, llm, busy }: { db: StopState; llm: StopState; busy: boolean }) {
  const stops: { label: string; icon: ReactNode; state: StopState }[] = [
    { label: "팀 DB", icon: <Glyph name="database" size={16} />, state: db },
    { label: "분석 모델", icon: <OpenAiMark size={15} />, state: llm },
    { label: "내 투자조건", icon: <Glyph name="sliders" size={16} />, state: "next" },
  ];
  return (
    <div className="flex items-center gap-2 rounded-t-[18px] border-b border-app-line bg-white px-4 py-3.5 text-[12px] font-medium text-app-sub sm:px-6">
      {stops.map((s, i) => (
        <div key={s.label} className="contents">
          {i > 0 && (
            <span
              className="min-w-3 flex-1 border-t-2 transition-colors duration-500"
              style={stops[i - 1].state === "done" ? { borderColor: SUCCESS, borderStyle: "solid" } : { borderStyle: "dashed" }}
            />
          )}
          <span className={`flex items-center gap-2 whitespace-nowrap ${s.state === "now" ? "font-bold text-app-main" : s.state === "done" ? "text-app-main" : ""}`}>
            <span
              className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-app-sunken transition-shadow ${s.state === "next" ? "opacity-60" : "text-app-main"}`}
              style={s.state === "now" && !busy ? { boxShadow: `0 0 0 2px ${ACCENT}` } : undefined}
            >
              {s.state === "now" && busy && <span className="cn-spin absolute -inset-0.5 rounded-full border-2 border-app-line" style={{ borderTopColor: ACCENT }} />}
              {s.icon}
              {s.state === "done" && (
                <span className="cn-pop absolute -right-1 -bottom-1 grid h-4 w-4 place-items-center rounded-full border-2 border-white text-white" style={{ background: SUCCESS }}>
                  <Glyph name="check" size={9} stroke={4} />
                </span>
              )}
            </span>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/** 가려진 입력칸: 넣은 글자는 점으로 찍히고, 누르면 파란 테가 생긴다 */
function SecretField({ icon, placeholder, dots, focused, busy, target }: { icon: ReactNode; placeholder: string; dots: number; focused: boolean; busy: boolean; target: string }) {
  return (
    <div
      data-cn={target}
      className={`flex h-12 items-center gap-3 rounded-[14px] border pr-2 pl-4 transition-[background-color,border-color,box-shadow] duration-200 ${focused ? "bg-white" : "border-transparent bg-app-sunken"}`}
      style={focused ? { borderColor: "#4880ee", boxShadow: "0 0 0 4px rgb(72 128 238 / 0.2)" } : undefined}
    >
      <span className="text-app-main">{icon}</span>
      <span className="flex min-w-0 flex-1 items-center overflow-hidden">
        {dots > 0 ? (
          <span className={`cn-dots truncate text-[13px] tracking-[0.06em] ${busy ? "text-app-sub" : "text-app-main"}`}>{"•".repeat(dots)}</span>
        ) : (
          !focused && <span className="truncate text-[13px] text-[#8b95a1]">{placeholder}</span>
        )}
        {focused && !busy && <span className="cn-caret ml-px h-4 w-px shrink-0 bg-app-main" />}
      </span>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-app-sub">
        <Glyph name="eye" size={17} />
      </span>
    </div>
  );
}

function SavedField({ icon, masked }: { icon: ReactNode; masked: string }) {
  return (
    <div className="flex h-12 items-center gap-3 rounded-[14px] bg-app-sunken pr-2 pl-4">
      <span className="text-app-main">{icon}</span>
      <code className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-app-main">{masked}</code>
      <span className="shrink-0 rounded-[10px] px-2.5 py-1.5 text-[12.5px] font-semibold" style={{ color: ACCENT }}>
        바꾸기
      </span>
    </div>
  );
}

function Facts({ items, show = true }: { items: { label: string; value: string }[]; show?: boolean }) {
  return (
    <dl className={`mx-1 mt-3.5 flex flex-wrap gap-x-6 gap-y-2 transition-opacity duration-300 sm:mx-3 ${show ? "opacity-100" : "opacity-0"}`}>
      {items.map((it) => (
        <div key={it.label} className="min-w-0">
          <dt className="text-[11px] text-app-sub">{it.label}</dt>
          <dd className="text-[12.5px] font-semibold [overflow-wrap:anywhere] text-app-main">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Notes({ rows }: { rows: typeof dbNotes }) {
  return (
    <ul className="cn-notes mt-4 grid gap-y-2.5 text-[12px] leading-snug sm:mx-3">
      {rows.map((n) => (
        <li key={n.title} className="cn-note">
          <Glyph name={n.icon} size={15} className="cn-note-icon text-app-sub" />
          <b className="cn-note-title font-bold whitespace-nowrap">{n.title}</b>
          <span className="cn-note-text text-app-body">{n.text}</span>
        </li>
      ))}
    </ul>
  );
}

function Primary({ children, pressed, busy = false, target }: { children: ReactNode; pressed: boolean; busy?: boolean; target: string }) {
  return (
    <span
      data-cn={target}
      data-pressed={pressed || undefined}
      className={`cn-btn ml-auto inline-flex min-h-10 items-center gap-2 rounded-[12px] px-5 text-[13px] font-semibold whitespace-nowrap text-white ${busy ? "cursor-progress" : ""}`}
      style={{ background: ACCENT }}
    >
      {busy && <span className="cn-spin h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white" />}
      {children}
    </span>
  );
}

function Ghost({ children }: { children: ReactNode }) {
  return <span className="-ml-2 rounded-[12px] px-2 py-2.5 text-[13px] font-semibold text-app-body">{children}</span>;
}

/** 화면 하나. 넷이 한 칸에 겹쳐 있고 지금 것만 보인다 */
function Pane({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <div className={`cn-pane rounded-b-[18px] bg-white px-4 pt-6 pb-5 sm:px-7 sm:pt-8 ${on ? "is-on" : ""}`} aria-hidden={!on || undefined}>
      {children}
    </div>
  );
}

/* ───────── 재생 ───────── */

const pointerAt: Partial<Record<SceneId, string>> = {
  "db-empty": "db-field",
  "db-type": "db-field",
  "db-filled": "db-submit",
  "db-press": "db-submit",
  "db-test": "db-submit",
  "db-done": "db-next",
  "db-next": "db-next",
  "llm-empty": "llm-field",
  "llm-type": "llm-field",
  "llm-filled": "llm-submit",
  "llm-press": "llm-submit",
  "llm-test": "llm-submit",
  "llm-done": "llm-next",
  "llm-next": "llm-next",
  end: "llm-next",
};

export default function ConnectScreen() {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLSpanElement>(null);
  const reduce = useRef(false);
  const userPaused = useRef(false);

  const scene = scenes[index];
  const id: SceneId = scene.id;
  const at = (...ids: SceneId[]) => ids.includes(id);
  const step = id.startsWith("db") ? "database" : "llm";
  const busy = id.endsWith("-test");

  // 화면에 보일 때만 돌린다. 동작 줄이기 설정이면 처음 장면에 머문다.
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!visible) setPlaying(false);
    else if (!userPaused.current && !reduce.current) setPlaying(true);
  }, [visible]);

  // 장면 넘기기
  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => {
      setIndex((i) => (i + 1) % scenes.length);
    }, scene.ms);
    return () => window.clearTimeout(t);
  }, [playing, index, scene.ms]);

  // 글자 찍기: 입력 장면 동안 점을 하나씩 늘린다
  useEffect(() => {
    const len = id === "db-type" ? DB_LEN : id === "llm-type" ? KEY_LEN : 0;
    if (!len) return;
    if (!playing) return;
    setTyped(0);
    const per = (scene.ms - 200) / len;
    let n = 0;
    const t = window.setInterval(() => {
      n += 1;
      setTyped(Math.min(n, len));
      if (n >= len) window.clearInterval(t);
    }, per);
    return () => window.clearInterval(t);
  }, [id, playing, scene.ms]);

  const dbDots = at("db-empty") ? 0 : at("db-type") ? typed : DB_LEN;
  const keyDots = at("llm-empty") ? 0 : at("llm-type") ? typed : KEY_LEN;

  // 손가락(포인터)을 지금 누를 곳으로 옮긴다
  const placePointer = useCallback(() => {
    const root = rootRef.current, p = pointerRef.current;
    if (!root || !p) return;
    const name = pointerAt[id];
    const el = name ? root.querySelector<HTMLElement>(`.cn-pane.is-on [data-cn="${name}"]`) : null;
    if (!el) return;
    const r = root.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    const isField = name?.endsWith("field");
    // 입력칸은 누른 뒤 글자를 가리지 않게 칸 아래로 살짝 비켜 둔다
    const typing = id.endsWith("-type") || id.endsWith("-filled");
    const x = b.left - r.left + (isField ? Math.min(b.width * 0.42, 190) + (typing ? 26 : 0) : b.width * 0.62);
    const y = b.top - r.top + (isField && typing ? b.height + 18 : b.height * 0.55);
    p.style.transform = `translate(${x}px, ${y}px)`;
  }, [id]);
  useLayoutEffect(placePointer, [placePointer]);
  useEffect(() => {
    window.addEventListener("resize", placePointer);
    return () => window.removeEventListener("resize", placePointer);
  }, [placePointer]);

  const toggle = () => {
    if (playing) {
      userPaused.current = true;
      setPlaying(false);
    } else {
      userPaused.current = false;
      if (id === "end") setIndex(0);
      setPlaying(true);
    }
  };
  const restart = () => {
    userPaused.current = false;
    setTyped(0);
    setIndex(0);
    setPlaying(true);
  };

  const pressing = at("db-press", "db-next", "llm-press", "llm-next");
  /** 누른 자리에 물결: 버튼을 누를 때와 입력칸을 눌러 쓰기 시작할 때 */
  const clicking = pressing || at("db-type", "llm-type");
  const started = playing || index > 0;

  return (
    <div>
      <p className="sr-only">
        연결 설정 화면 예시: 팀 DB 주소를 넣고 「연결하기」를 누르면 접속을 확인한 뒤 최신 거래일과 자료 시작일을 보여 줍니다. 이어서 OpenAI API 키를
        넣어 연결하고 「내 투자조건 설정으로」 넘어갑니다.
      </p>
      <div ref={rootRef} className="cn relative bg-app-canvas px-3 py-5 text-app-main sm:px-6 sm:py-7" aria-hidden="true">
        <div className="mx-auto max-w-[580px]">
          <Track db={step === "database" ? (at("db-done", "db-next") ? "done" : "now") : "done"} llm={step === "database" ? "next" : at("llm-done", "llm-next", "end") ? "done" : "now"} busy={busy} />

          <div className="cn-stack">
            {/* 1. 팀 DB 주소 넣기 */}
            <Pane on={at("db-empty", "db-type", "db-filled", "db-press", "db-test")}>
              <p className="text-[19px] leading-snug font-bold tracking-[-0.02em]">팀에서 받은 DB 주소를 붙여 넣어 주세요</p>
              <div className="mt-5">
                <SecretField
                  target="db-field"
                  icon={<Glyph name="database" size={19} />}
                  placeholder="postgresql://계정:비밀번호@서버:5432/이름"
                  dots={dbDots}
                  focused={!at("db-empty")}
                  busy={busy}
                />
              </div>
              <Facts
                show={dbDots === DB_LEN}
                items={[
                  { label: "서버", value: "db.example.com" },
                  { label: "포트", value: "5432" },
                  { label: "데이터베이스", value: "myfinsight" },
                  { label: "계정", value: "reader" },
                ]}
              />
              <Notes rows={dbNotes} />
              <p className="mt-2.5 text-right text-[12px] font-semibold" style={{ color: ACCENT }}>
                항목별로 입력
              </p>
              <div className="mt-5 flex items-center gap-3">
                <Ghost>{busy ? "취소" : "나중에 하기"}</Ghost>
                <Primary target="db-submit" pressed={at("db-press")} busy={busy}>
                  {busy ? "연결을 확인하는 중…" : "연결하기"}
                </Primary>
              </div>
              <p className={`mt-2 text-[12px] text-app-sub ${busy ? "invisible" : ""}`}>지금 연결하지 않아도 예시 데이터로 둘러볼 수 있습니다.</p>
            </Pane>

            {/* 2. 팀 DB 연결됨 */}
            <Pane on={at("db-done", "db-next")}>
              <p className="text-[19px] leading-snug font-bold tracking-[-0.02em]">팀 DB에 연결했습니다</p>
              <div className="mt-5">
                <SavedField icon={<Glyph name="database" size={19} />} masked={DB_MASKED} />
              </div>
              <Facts
                items={[
                  { label: "최신 거래일", value: "2026-10-30" },
                  { label: "미국 자료 시작일", value: "1993-01-29" },
                  { label: "한국 자료 시작일", value: "2002-10-14" },
                ]}
              />
              <div className="mt-7 flex items-center">
                <Primary target="db-next" pressed={at("db-next")}>
                  다음
                </Primary>
              </div>
            </Pane>

            {/* 3. OpenAI 키 넣기 */}
            <Pane on={at("llm-empty", "llm-type", "llm-filled", "llm-press", "llm-test")}>
              <p className="text-[19px] leading-snug font-bold tracking-[-0.02em]">OpenAI API 키를 넣어 주세요</p>
              <div className="mt-5">
                <SecretField
                  target="llm-field"
                  icon={<OpenAiMark size={19} />}
                  placeholder="팀에서 받은 키 또는 직접 만든 키"
                  dots={keyDots}
                  focused={!at("llm-empty")}
                  busy={busy}
                />
              </div>
              <Notes rows={llmNotes} />
              <div className="mt-2.5 flex items-center justify-between text-[12px] font-semibold sm:mx-3">
                <span className="inline-flex items-center gap-1 text-app-sub">
                  자세히
                  <Glyph name="chevron" size={13} className="rotate-90" />
                </span>
                <span style={{ color: ACCENT }}>API 키 만들기</span>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <Ghost>{busy ? "취소" : "나중에 하기"}</Ghost>
                <Primary target="llm-submit" pressed={at("llm-press")} busy={busy}>
                  {busy ? "연결을 확인하는 중…" : "연결하기"}
                </Primary>
              </div>
              <p className={`mt-2 text-[12px] text-app-sub ${busy ? "invisible" : ""}`}>지금 연결하지 않아도 미리 만든 답으로 둘러볼 수 있습니다.</p>
            </Pane>

            {/* 4. OpenAI 연결됨 */}
            <Pane on={at("llm-done", "llm-next", "end")}>
              <p className="text-[19px] leading-snug font-bold tracking-[-0.02em]">OpenAI에 연결했습니다</p>
              <div className="mt-5">
                <SavedField icon={<OpenAiMark size={19} />} masked={KEY_MASKED} />
              </div>
              <div className="mt-7 flex items-center">
                <Primary target="llm-next" pressed={at("llm-next")}>
                  내 투자조건 설정으로
                </Primary>
              </div>
            </Pane>
          </div>
        </div>

        {/* 누르는 손가락 자리 (마우스 포인터) */}
        <span ref={pointerRef} className={`cn-pointer ${started ? "is-on" : ""} ${clicking ? "is-click" : ""}`}>
          <span className="cn-ripple" />
          {/* Windows 기본 화살표 모양 (흰 몸통, 검은 테두리, 꼬리). 그림 파일을 쓰지 않고 같은 모양을 그린다 */}
          <svg width="15" height="23" viewBox="0 0 15 23" fill="none">
            <path d="M1 1v16.6l3.95-3.8 2.75 6.55 2.55-1.08-2.7-6.4H13.1Z" fill="#fff" stroke="#000" strokeWidth="0.75" strokeLinejoin="miter" />
          </svg>
        </span>
      </div>

      <div className="flex items-center justify-end gap-1 border-t border-[#e2e8f0] bg-white px-2 py-1">
        <button type="button" onClick={toggle} className="cn-ctl" aria-label={playing ? "연결 과정 재생 멈추기" : "연결 과정 재생하기"}>
          <Glyph name={playing ? "pause" : "play"} size={15} />
          {playing ? "멈춤" : "재생"}
        </button>
        <button type="button" onClick={restart} className="cn-ctl" aria-label="연결 과정 처음부터 다시 보기">
          <Glyph name="rotate" size={15} />
          처음부터
        </button>
      </div>
    </div>
  );
}
