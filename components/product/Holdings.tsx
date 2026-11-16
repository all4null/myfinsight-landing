/** 종목 구성 막대 + 범례 (앱 report Dashboard 의 "종목 구성 · N종목") */
import { scenario } from "@/lib/example";

export default function Holdings() {
  return (
    <>
      <p className="text-[13px] font-bold">종목 구성 · {scenario.holdings.length}종목</p>
      <div className="mt-2.5 flex h-2.5 gap-[2px] overflow-hidden rounded-full" aria-hidden="true">
        {scenario.holdings.map((h) => (
          <span key={h.ticker} style={{ width: `${h.weight * 100}%`, background: h.color }} />
        ))}
      </div>
      <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px]">
        {scenario.holdings.map((h) => (
          <li key={h.ticker} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: h.color }} />
            <span className="font-medium">{h.name}</span>
            <span className="num text-[#56667c]">{(h.weight * 100).toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </>
  );
}
