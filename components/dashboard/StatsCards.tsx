import { totals } from "@/lib/data";
import { formatCompact, pct } from "@/lib/utils";

const utilizationPct = pct(totals.obligation, totals.allotment);
const disbursPct = pct(totals.disbursement, totals.obligation);
const releasePct = pct(totals.allotment, totals.appropriation);

const stats = [
  {
    label: "Total Appropriation",
    value: totals.appropriation,
    meta: "GAA FY 2026",
    rate: null,
    rateLabel: null,
  },
  {
    label: "Allotment Released",
    value: totals.allotment,
    meta: "via SARO / GARO",
    rate: releasePct,
    rateLabel: "% of appropriation",
  },
  {
    label: "Total Obligations",
    value: totals.obligation,
    meta: "Obligations incurred",
    rate: utilizationPct,
    rateLabel: "% of allotment",
  },
  {
    label: "Total Disbursements",
    value: totals.disbursement,
    meta: "Actual cash payments",
    rate: disbursPct,
    rateLabel: "% of obligation",
  },
];

function rateColor(r: number) {
  if (r >= 85) return "text-emerald-600";
  if (r >= 65) return "text-amber-600";
  return "text-red-500";
}

export default function StatsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 rounded-xl overflow-hidden border border-gray-200">
      {stats.map((s, i) => (
        <div key={s.label} className="bg-white px-5 py-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-400">
            {s.label}
          </p>
          <p className="mt-2.5 text-[26px] font-black text-gray-900 num leading-none tracking-tight">
            {formatCompact(s.value)}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            {s.rate !== null ? (
              <>
                <span className={`text-[11px] font-bold num ${rateColor(s.rate)}`}>
                  {s.rate}%
                </span>
                <span className="text-[11px] text-gray-400">{s.rateLabel}</span>
              </>
            ) : (
              <span className="text-[11px] text-gray-400">{s.meta}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
