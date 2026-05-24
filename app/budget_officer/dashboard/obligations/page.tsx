"use client";

import { useState } from "react";
import { Search, Download } from "lucide-react";

const obligations = [
  { id: "ORS-2026-001", date: "2026-01-15", supplier: "ABC Textbook Publishers",      amount: 2450000,  category: "Learning Materials", status: "Obligated" },
  { id: "ORS-2026-002", date: "2026-01-20", supplier: "Tech Solutions Inc.",           amount: 5600000,  category: "Equipment",          status: "Obligated" },
  { id: "ORS-2026-003", date: "2026-02-01", supplier: "Construction Experts Co.",      amount: 8900000,  category: "Infrastructure",      status: "Obligated" },
  { id: "ORS-2026-004", date: "2026-02-10", supplier: "Professional Training Services",amount: 1800000,  category: "Personnel",          status: "Obligated" },
  { id: "ORS-2026-005", date: "2026-02-15", supplier: "Nutrition Supplies Ltd.",       amount: 12300000, category: "Maintenance",        status: "Obligated" },
  { id: "ORS-2026-006", date: "2026-03-01", supplier: "Furniture Makers Inc.",         amount: 3500000,  category: "Equipment",          status: "For Approval" },
  { id: "ORS-2026-007", date: "2026-03-05", supplier: "Software Developers Corp.",     amount: 4200000,  category: "Equipment",          status: "For Approval" },
  { id: "ORS-2026-008", date: "2026-03-10", supplier: "Educational Materials Co.",     amount: 2100000,  category: "Learning Materials", status: "Obligated" },
];

const categoryDot: Record<string, string> = {
  "Learning Materials": "bg-blue-400",
  Equipment:            "bg-amber-400",
  Infrastructure:       "bg-purple-400",
  Personnel:            "bg-green-500",
  Maintenance:          "bg-gray-400",
};

const fmt = (n: number) => `₱${(n / 1_000_000).toFixed(2)}M`;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });

export default function ObligationsPage() {
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filtered = obligations.filter((o) => {
    const q = search.toLowerCase();
    return (
      (o.id.toLowerCase().includes(q) || o.supplier.toLowerCase().includes(q)) &&
      (statusFilter === "All" || o.status === statusFilter) &&
      (categoryFilter === "All" || o.category === categoryFilter)
    );
  });

  const totalObligated   = obligations.filter(o => o.status === "Obligated").reduce((s, o) => s + o.amount, 0);
  const totalForApproval = obligations.filter(o => o.status === "For Approval").reduce((s, o) => s + o.amount, 0);
  const totalAmount      = obligations.reduce((s, o) => s + o.amount, 0);
  const categories       = [...new Set(obligations.map((o) => o.category))];

  const metrics = [
    { label: "Total Obligated",  value: fmt(totalObligated),   color: "text-green-700",  bar: Math.round((totalObligated / totalAmount) * 100),   barColor: "bg-green-600" },
    { label: "For Approval",     value: fmt(totalForApproval), color: "text-amber-600",  bar: Math.round((totalForApproval / totalAmount) * 100), barColor: "bg-amber-500" },
    { label: "Total ORS Count",  value: String(obligations.length), color: "text-deped-blue", bar: 100, barColor: "bg-deped-blue" },
  ];

  return (
    <div className="space-y-5">

      {/* Page header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-[13px] font-semibold text-gray-900">Obligations</h1>
          <p className="text-[11px] text-gray-400 mt-0.5">ORS Register and Obligation Tracking · FY 2026</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-deped-blue hover:bg-blue-900 text-white text-[11px] font-medium rounded-lg transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export ORS
        </button>
      </div>

      {/* Metric cards */}
      <div>
        <p className="text-[10px] font-medium tracking-widest text-gray-400 uppercase mb-2.5">Key figures</p>
        <div className="grid grid-cols-3 gap-2.5">
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

      {/* Filters */}
      <div className="flex gap-2 flex-wrap items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search ORS ID or supplier…"
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
          <option>Obligated</option>
          <option>For Approval</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-8 px-2.5 text-[11px] border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-1 focus:ring-deped-blue transition"
        >
          <option>All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase">ORS ID</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase">Supplier</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase">Category</th>
                <th className="px-4 py-2 text-right text-[10px] font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-4 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 text-[11px] font-medium text-deped-blue">{o.id}</td>
                  <td className="px-4 py-2 text-[11px] text-gray-600">{fmtDate(o.date)}</td>
                  <td className="px-4 py-2 text-[11px] text-gray-700">{o.supplier}</td>
                  <td className="px-4 py-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${categoryDot[o.category]}`} />
                      <span className="text-gray-700">{o.category}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right text-[11px] font-medium text-gray-900">{fmt(o.amount)}</td>
                  <td className="px-4 py-2 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-medium ${
                      o.status === "Obligated"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {o.status}
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
