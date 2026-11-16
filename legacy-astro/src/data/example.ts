/**
 * 랜딩페이지의 "예시 화면"이 함께 쓰는 하나의 예시 시나리오.
 *
 * - 실제 분석 결과가 아니다. 화면에는 항상 "예시 화면" 표시를 붙인다.
 * - 화면 문구(단계 이름, 버튼, 라벨)는 MyFinSight 앱(Front/src)의 실제 문구를 따른다.
 * - 수익률 곡선은 시드를 고정한 난수로 만들고, 화면의 수익률·최대낙폭은 그 곡선에서 계산한다.
 *   그래서 차트와 숫자가 서로 어긋나지 않는다.
 */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(r: () => number) {
  const u = Math.max(r(), 1e-12);
  const v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const SEED = 1239;
const DAYS = 784; // 앱 예시와 같은 약 3년치 거래일

function makeSeries() {
  const r = mulberry32(SEED);
  const strategy = [1];
  const benchmark = [1];
  for (let i = 1; i < DAYS; i++) {
    const market = gauss(r) * 0.0095;
    const own = gauss(r) * 0.0115;
    benchmark.push(benchmark[i - 1] * (1 + 0.00042 + market));
    strategy.push(strategy[i - 1] * (1 + 0.00052 + market * 1.25 + own));
  }
  return { strategy, benchmark };
}

function maxDrawdown(x: number[]) {
  let peak = x[0];
  let worst = 0;
  for (const v of x) {
    peak = Math.max(peak, v);
    worst = Math.min(worst, v / peak - 1);
  }
  return worst;
}

const years = DAYS / 261.33; // 784거래일 ≈ 3년

const { strategy, benchmark } = makeSeries();

export const series = { strategy, benchmark };

const totalS = strategy[strategy.length - 1] - 1;
const totalB = benchmark[benchmark.length - 1] - 1;
const cagr = (t: number) => Math.pow(1 + t, 1 / years) - 1;

export const metrics = {
  totalStrategy: totalS,
  totalBenchmark: totalB,
  cagrStrategy: cagr(totalS),
  cagrBenchmark: cagr(totalB),
  mddStrategy: maxDrawdown(strategy),
  mddBenchmark: maxDrawdown(benchmark),
  lossTolerance: -0.2,
};

export const pct = (v: number, digits = 1) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v * 100).toFixed(digits)}%`;
export const pctPlain = (v: number, digits = 1) => `${Math.abs(v * 100).toFixed(digits)}%`;

/** 차트용: 시작=0% 기준의 누적 수익률 점 목록을 SVG path 로 바꾼다 */
export function toPath(values: number[], w: number, h: number, min: number, max: number, step = 3) {
  const pts: string[] = [];
  const n = values.length - 1;
  for (let i = 0; i <= n; i += step) {
    const x = (i / n) * w;
    const y = h - ((values[i] - 1 - min) / (max - min)) * h;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const lastY = h - ((values[n] - 1 - min) / (max - min)) * h;
  pts.push(`${w},${lastY.toFixed(1)}`);
  return `M${pts.join("L")}`;
}

export const chartRange = (() => {
  const all = [...strategy, ...benchmark].map((v) => v - 1);
  const lo = Math.floor(Math.min(...all) * 10) / 10;
  const hi = Math.ceil(Math.max(...all) * 10) / 10;
  return { min: Math.min(lo, -0.1), max: hi };
})();

export const scenario = {
  name: "미국 반도체 장비·메모리 분산 투자",
  idea: "미국 반도체 장비와 메모리 기업에 나눠 투자하고 싶어요. 한 종목에 너무 몰리지 않았으면 좋겠어요.",
  understanding: "반도체 장비·메모리 반도체 기업에 나눠 투자하려는 요청으로 이해했습니다.",
  themes: ["반도체 장비", "메모리 반도체"],
  strategy: "역변동성비중",
  asOf: "2026-10-30",
  period: "2023-10-31 ~ 2026-10-30",
  benchmark: "SPY",
  verdict: "추천(주의)",
  // 역변동성 비중에 종목당 상한 20%를 적용한 모양 (ASML 은 상한에 걸려 20%)
  holdings: [
    { name: "ASML Holding", ticker: "ASML", weight: 0.2, color: "var(--color-hold-1)" },
    { name: "KLA", ticker: "KLAC", weight: 0.19, color: "var(--color-hold-2)" },
    { name: "Applied Materials", ticker: "AMAT", weight: 0.17, color: "var(--color-hold-3)" },
    { name: "Lam Research", ticker: "LRCX", weight: 0.16, color: "var(--color-hold-4)" },
    { name: "NVIDIA", ticker: "NVDA", weight: 0.14, color: "var(--color-hold-5)" },
    { name: "Micron Technology", ticker: "MU", weight: 0.14, color: "var(--color-hold-6)" },
  ],
};

/** 보충 질문 (앱 ClarifyScreen 의 실제 질문 형식) */
export const question = {
  label: "질문 1",
  tag: "필수",
  field: "관련 항목: 종목당 최대 비중",
  title: "한 종목에 최대 몇 %까지 담을까요?",
  why: "반도체 기업끼리는 함께 오르내리는 경우가 많아, 한 종목에 너무 쏠리지 않게 상한을 정합니다.",
  options: ["15%", "20%", "25%"],
  picked: "20%",
};

/** 조건 확인 표 (앱 ConfirmScreen 의 출처 태그: 기본 투자조건 / 아이디어 / 답변·직접 변경 / 기본값 / 계산) */
export const conditions = [
  { label: "투자금", value: "₩20,000,000", source: "기본 투자조건" },
  { label: "투자기간", value: "3년", source: "기본 투자조건" },
  { label: "손실 감내 수준", value: "20%", source: "기본 투자조건" },
  { label: "투자 대상", value: "S&P 500 · NASDAQ-100", source: "아이디어" },
  { label: "종목당 최대 비중", value: "20%", source: "답변·직접 변경", changed: true },
  { label: "리밸런싱", value: "분기", source: "기본값" },
  { label: "비교지수", value: "SPY", source: "기본값" },
];

/** 분석 진행 5묶음 (앱 run/steps.ts) — 세부 단계 수는 앱의 14단계 구성을 따른다 */
export const runGroups = [
  { name: "조건과 자료 확인", detail: 2 },
  { name: "종목 선정과 투자 비중 계산", detail: 5 },
  { name: "과거 성과 분석", detail: 4 },
  { name: "내 투자조건 충족 여부 점검", detail: 1 },
  { name: "분석 결과 정리 및 리포트 작성", detail: 2 },
];

/** 조건 점검 결과 (앱의 규칙 표시: 충족 / 주의 / 미충족) */
export const checks = [
  { rule: "종목당 최대 비중 20%", result: "충족", tone: "ok" },
  { rule: "과거 최대낙폭과 손실 감내 수준", result: "주의", tone: "warn" },
  { rule: "비교지수 대비 수익률", result: "충족", tone: "ok" },
  { rule: "자료 정합성", result: "충족", tone: "ok" },
] as const;
