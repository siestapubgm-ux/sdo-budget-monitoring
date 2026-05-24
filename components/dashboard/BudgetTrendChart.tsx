"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { monthlyTrend } from "@/lib/data";
import { formatCompact } from "@/lib/utils";

function shortPeso(v: number) {
  if (v >= 1_000_000_000) return `₱${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `₱${(v / 1_000_000).toFixed(0)}M`;
  return `₱${(v / 1_000).toFixed(0)}K`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[150px]">
      <p className="text-[11px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-[11px] text-gray-500">{p.name}</span>
          </div>
          <span className="text-[11px] font-semibold text-gray-800 num">{shortPeso(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function BudgetTrendChart() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 h-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
            Monthly Trend
          </p>
          <p className="text-[14px] font-semibold text-gray-800 mt-0.5">
            Cumulative Budget Movement
          </p>
        </div>
        <span className="text-[10px] text-gray-400 mt-1">Jan – May 2026</span>
      </div>

      <ResponsiveContainer width="100%" height={230}>
        <AreaChart data={monthlyTrend} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gAllot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#2563EB" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gOblig" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#D97706" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#D97706" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gDisb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#16a34a" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={shortPeso}
            tick={{ fontSize: 10, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={6}
            wrapperStyle={{ fontSize: 11, color: "#64748B", paddingTop: 12 }}
          />
          <Area type="monotone" dataKey="allotment"    name="Allotment"    stroke="#2563EB" strokeWidth={1.5} fill="url(#gAllot)" dot={false} />
          <Area type="monotone" dataKey="obligation"   name="Obligation"   stroke="#D97706" strokeWidth={1.5} fill="url(#gOblig)" dot={false} />
          <Area type="monotone" dataKey="disbursement" name="Disbursement" stroke="#16a34a" strokeWidth={1.5} fill="url(#gDisb)"  dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
