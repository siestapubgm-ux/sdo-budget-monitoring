"use client";

import { useState } from "react";
import { Search, Download } from "lucide-react";

const paps = [
  { id: "PAP-001", title: "Teacher Development Program",       amount: 45200000,  allocated: 43100000,  utilization: 95.3, status: "Active" },
  { id: "PAP-002", title: "School Infrastructure Improvement", amount: 78500000,  allocated: 65300000,  utilization: 83.1, status: "Active" },
  { id: "PAP-003", title: "Learning Materials Procurement",    amount: 34800000,  allocated: 34800000,  utilization: 100,  status: "Completed" },
  { id: "PAP-004", title: "ICT Equipment Distribution",        amount: 52100000,  allocated: 31200000,  utilization: 59.9, status: "In Progress" },
  { id: "PAP-005", title: "Special Education Support",         amount: 18900000,  allocated: 15400000,  utilization: 81.5, status: "Active" },
  { id: "PAP-006", title: "Nutritional Support Program",       amount: 156300000, allocated: 156300000, utilization: 100,  status: "Completed" },
];

const statusStyles: Record<string, string> = {
  Completed:    "bg-green-100 text-green-800",
  Active:       "bg-blue-100 text-blue-800",
  "In Progress":"bg-amber-100 text-amber-800",
};

const utilizationColor = (pct: number) => {
  if (pct >= 90) return "bg-green-600";
  if (pct >= 70) return "bg-blue-600";
  return "bg-amber-500";
};

const fmt = (n: number) => `₱${(n / 1_000_000).toFixed(2)}M`;

export default function BudgetPage() {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = paps.filter((p) => {
    const q = search.toLowerCase();
    return (
      (p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) &&
      (statusFilter === "All" || p.status === statusFilter)
    );
  });

  const totalBudget    = paps.reduce((s, p) => s + p.amount, 0);
  const totalAllocated = paps.reduce((s, p) => s + p.allocated, 0);
  const avgUtil        = (paps.reduce((s, p) => s + p.utilization, 0) / paps.length).toFixed(1);
  const activeCount    = paps.filter((p) => p.status === "Active").length;

  const metrics = [
    { label: "Total Budget",    value: fmt(totalBudget),    color: "text-gray-900",   bar: 100,                                         barColor: "bg-deped-blue" },
    { label: "Allocated",       value: fmt(totalAllocated), color: "text-deped-blue", bar: Math.round((totalAllocated/totalBudget)*100), barColor: "bg-deped-blue" },
    { label: "Avg Utilization", value: `${avgUtil}%`,       color: "text-green-700",  bar: parseFloat(avgUtil),                         barColor: "bg-green-600" },
    { label: "Active Projects", value: String(activeCount), color: "text-amber-600",  bar: Math.round((activeCount/paps.length)*100),   barColor: "bg-amber-500" },
  ];

  return (
    <div className="space-y-5">

      {/* Page header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-[13px] font-semibold text-gray-900">Budget Allocation</h1>
          <p className="text-[11px] text-gray-400 mt-0.5">Programs, Activities & Projects (PAPs) · FY 2026</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-deped-blue hover:bg-blue-900 text-white text-[11px] font-medium rounded-lg transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export report
        </button>
      </div>

      {/* Metric cards */}
      <div>
        <p className="text-[10px] font-medium tracking-widest text-gray-400 uppercase mb-2.5">Key figures</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {metrics.map((m) => (
            <div key={m.label} className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] font-medium text-gray-500 mb-1.5">{m.label}</p>
              <p className={`text-[19px] font-semibold leading-none ${m.color}`}>{m.value}</p>
              <div className="h-[3px] bg-gray-200 rounded-full mt-2.5">
                <div className={`h-full rounded-full ${m.barColor}`} style={{ width: `${m.bar}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & filter */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search PAP ID or title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 h-8 text-[12px] border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-1 focus:ring-deped-blue focus:border-deped-blue transition"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-8 px-2.5 text-[11px] border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-1 focus:ring-deped-blue transition"
        >
          <option>All</option>
          <option>Active</option>
          <option>Completed</option>
          <option>In Progress</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase">PAP ID</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase">Title</th>
                <th className="px-4 py-2 text-right text-[10px] font-semibold text-gray-600 uppercase">Budget</th>
                <th className="px-4 py-2 text-right text-[10px] font-semibold text-gray-600 uppercase">Allocated</th>
                <th className="px-4 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase">Util %</th>
                <th className="px-4 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 text-[11px] font-medium text-deped-blue">{p.id}</td>
                  <td className="px-4 py-2 text-[11px] text-gray-700">{p.title}</td>
                  <td className="px-4 py-2 text-right text-[11px] font-medium text-gray-900">{fmt(p.amount)}</td>
                  <td className="px-4 py-2 text-right text-[11px] font-medium text-gray-900">{fmt(p.allocated)}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-12 h-[6px] bg-gray-200 rounded-full">
                        <div className={`h-full rounded-full ${utilizationColor(p.utilization)}`} style={{ width: `${p.utilization}%` }} />
                      </div>
                      <span className="text-[10px] font-semibold text-gray-600">{p.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-medium ${statusStyles[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
