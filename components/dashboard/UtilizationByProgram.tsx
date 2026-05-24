import { programSummaries } from "@/lib/data";
import { formatCompact, pct } from "@/lib/utils";

export default function UtilizationByProgram() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
          Utilization Rate
        </p>
        <p className="text-[14px] font-semibold text-gray-800 mt-0.5">
          By Program
        </p>
      </div>

      <div className="space-y-4">
        {programSummaries.map((p) => {
          const util = pct(p.obligation, p.allotment);
          const disb = pct(p.disbursement, p.obligation);
          const color =
            util >= 85 ? "#16a34a" : util >= 65 ? "#D97706" : "#DC2626";

          return (
            <div key={p.short}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                    {p.short}
                  </span>
                  <span className="text-[11px] font-medium text-gray-700 truncate max-w-[140px]">
                    {p.program}
                  </span>
                </div>
                <span
                  className="text-[12px] font-black num"
                  style={{ color }}
                >
                  {util}%
                </span>
              </div>

              {/* Obligation bar */}
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(util, 100)}%`, background: color }}
                />
              </div>

              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-gray-400">
                  {formatCompact(p.obligation)} obligated of {formatCompact(p.allotment)}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold num">
                  {disb}% disbursed
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
