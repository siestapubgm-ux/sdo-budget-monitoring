"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { expenseSummaries, totals } from "@/lib/data";
import { formatCompact, pct } from "@/lib/utils";

const COLORS = ["#1E3A8A", "#2563EB", "#16a34a"];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow p-2.5 text-[11px]">
      <p className="font-semibold text-gray-700">{d.name}</p>
      <p className="text-gray-500 mt-1 num">{formatCompact(d.value)}</p>
      <p className="text-gray-400 num">{pct(d.value, totals.appropriation)}% share</p>
    </div>
  );
};

export default function ExpenseClassChart() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 h-full">
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
          Expense Class
        </p>
        <p className="text-[14px] font-semibold text-gray-800 mt-0.5">
          Appropriation Breakdown
        </p>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={expenseSummaries}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={48}
            dataKey="value"
            paddingAngle={2}
          >
            {expenseSummaries.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-3 space-y-2.5 border-t border-gray-100 pt-3">
        {expenseSummaries.map((e, i) => (
          <div key={e.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-sm flex-shrink-0"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="text-[11px] text-gray-600">{e.name}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[12px] font-semibold text-gray-800 num">
                {formatCompact(e.value)}
              </span>
              <span className="text-[10px] text-gray-400 num">
                {pct(e.value, totals.appropriation)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

