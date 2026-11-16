/** 누적 수익률 선 그래프 (앱 ChartFrame 처럼: 가로 격자만, 선택 전략 선을 굵게). 빌드할 때 SVG 로 그린다. */
import { series, chartRange, toPath, metrics, pct, scenario } from "@/lib/example";

export default function LineChart({ height = 190 }: { height?: number }) {
  const W = 600;
  const H = height;
  const { min, max } = chartRange;
  const ticks: number[] = [];
  for (let t = Math.ceil(min * 10) / 10; t <= max + 1e-9; t += 0.2) ticks.push(Math.round(t * 10) / 10);
  const y = (v: number) => H - ((v - min) / (max - min)) * H;
  const label = `예시 누적 수익률 그래프: ${scenario.period} 동안 선택 전략 ${pct(metrics.totalStrategy)}, 비교지수 ${scenario.benchmark} ${pct(metrics.totalBenchmark)}.`;

  return (
    <figure className="m-0">
      <div className="flex">
        <div className="num relative mr-2 w-8 shrink-0 text-right text-[10px] text-[#56667c]" style={{ height: H }} aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: y(t) }}>
              {Math.round(t * 100)}%
            </span>
          ))}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block min-w-0 flex-1 overflow-visible" style={{ height: H }} role="img" aria-label={label}>
          {ticks.map((t) => (
            <line
              key={t}
              x1="0"
              x2={W}
              y1={y(t)}
              y2={y(t)}
              stroke={t === 0 ? "#94a3b8" : "#e2e8f0"}
              strokeDasharray={t === 0 ? "4 4" : undefined}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path d={toPath(series.benchmark, W, H, min, max)} fill="none" stroke="var(--color-series-2)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          <path d={toPath(series.strategy, W, H, min, max)} fill="none" stroke="var(--color-series-1)" strokeWidth="2.2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        </svg>
      </div>
      <figcaption className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-[11.5px] text-[#334155]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--color-series-1)]" />
          선택 전략 <b className="num font-semibold">{pct(metrics.totalStrategy)}</b>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--color-series-2)]" />
          {scenario.benchmark} 매수보유 <b className="num font-semibold">{pct(metrics.totalBenchmark)}</b>
        </span>
      </figcaption>
    </figure>
  );
}
