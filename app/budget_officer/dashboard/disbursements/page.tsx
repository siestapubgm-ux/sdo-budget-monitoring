"use client";

import { useState } from "react";
import { Search, Download } from "lucide-react";

const disbursements = [
  { id: "DV-2026-0001", date: "2026-01-18", payee: "ABC Textbook Publishers",       amount: 2450000, description: "Learning Materials - Q1",        method: "Check",         status: "Completed" },
  { id: "DV-2026-0002", date: "2026-01-25", payee: "Tech Solutions Inc.",            amount: 5600000, description: "Computer Equipment",              method: "Bank Transfer", status: "Completed" },
  { id: "DV-2026-0003", date: "2026-02-05", payee: "Construction Experts Co.",       amount: 4450000, description: "School Building Repair Phase 1",  method: "Check",         status: "Completed" },
  { id: "DV-2026-0004", date: "2026-02-12", payee: "Professional Training Services", amount: 1800000, description: "Teacher Training Program",        method: "Bank Transfer", status: "Completed" },
  { id: "DV-2026-0005", date: "2026-02-20", payee: "Nutrition Supplies Ltd.",        amount: 6150000, description: "School Feeding Program - Feb",     method: "Bank Transfer", status: "Processing" },
  { id: "DV-2026-0006", date: "2026-03-01", payee: "Furniture Makers Inc.",          amount: 3500000, description: "Classroom Furniture",             method: "Check",         status: "Processing" },
  { id: "DV-2026-0007", date: "2026-03-08", payee: "Software Developers Corp.",      amount: 2100000, description: "Learning Management System",      method: "Bank Transfer", status: "Pending" },
  { id: "DV-2026-0008", date: "2026-03-15", payee: "Educational Materials Co.",      amount: 1800000, description: "Library Books & Magazines",       method: "Check",         status: "Pending" },
];

const statusStyles: Record<string, string> = {
  Completed:  "bg-green-100 text-green-800",
  Processing: "bg-blue-100 text-blue-800",
  Pending:    "bg-amber-100 text-amber-700",
};

const methodStyles: Record<string, string> = {
  "Check":         "bg-gray-100 text-gray-600",
  "Bank Transfer": "bg-deped-blue/10 text-deped-blue",
};

const fmt = (n: number) => `₱${(n / 1_000_000).toFixed(2)}M`;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });

export default function DisbursementsPage() {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");

  const filtered = disbursements.filter((d) => {
    const q = search.toLowerCase();
    return (
      (d.id.toLowerCase().includes(q) || d.payee.toLowerCase().includes(q)) &&
      (statusFilter === "All" || d.status === statusFilter) &&
      (methodFilter === "All" || d.method === methodFilter)
    );
  });

  const totalAmount     = disbursements.reduce((s, d) => s + d.amount, 0);
  const totalCompleted  = disbursements.filter(d => d.status === "Completed").reduce((s, d) => s + d.amount, 0);
  const totalProcessing = disbursements.filter(d => d.status === "Processing").reduce((s, d) => s + d.amount, 0);
  const totalPending    = disbursements.filter(d => d.status === "Pending").reduce((s, d) => s + d.amount, 0);

  const metrics = [
    { label: "Completed",      value: fmt(totalCompleted),  color: "text-green-700",  bar: Math.round((totalCompleted  / totalAmount) * 100), barColor: "bg-green-600" },
    { label: "Processing",     value: fmt(totalProcessing), color: "text-blue-700",   bar: Math.round((totalProcessing / totalAmount) * 100), barColor: "bg-blue-600" },
    { label: "Pending",        value: fmt(totalPending),    color: "text-amber-600",  bar: Math.round((totalPending    / totalAmount) * 100), barColor: "bg-amber-500" },
    { label: "Total DV Count", value: String(disbursements.length), color: "text-deped-blue", bar: 100, barColor: "bg-deped-blue" },
  ];

  return (
    <div className="space-y-5">

      {/* Page header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-[13px] font-semibold text-gray-900">Disbursements</h1>
          <p className="text-[11px] text-gray-400 mt-0.5">Disbursement Vouchers and Payment Tracking · FY 2026</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-deped-blue hover:bg-blue-900 text-white text-[11px] font-medium rounded-lg transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export vouchers
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

      {/* Filters */}
      <div className="flex gap-2 flex-wrap items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search DV number or payee…"
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
          <option>Completed</option>
          <option>Processing</option>
          <option>Pending</option>
        </select>
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="h-8 px-2.5 text-[11px] border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-1 focus:ring-deped-blue transition"
        >
          <option>All Methods</option>
          <option>Check</option>
          <option>Bank Transfer</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase">DV Number</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase">Payee</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase">Description</th>
                <th className="px-4 py-2 text-right text-[10px] font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-4 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase">Method</th>
                <th className="px-4 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 text-[11px] font-medium text-deped-blue">{d.id}</td>
                  <td className="px-4 py-2 text-[11px] text-gray-600">{fmtDate(d.date)}</td>
                  <td className="px-4 py-2 text-[11px] text-gray-700">{d.payee}</td>
                  <td className="px-4 py-2 text-[11px] text-gray-600">{d.description}</td>
                  <td className="px-4 py-2 text-right text-[11px] font-medium text-gray-900">{fmt(d.amount)}</td>
                  <td className="px-4 py-2 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-medium ${methodStyles[d.method]}`}>
                      {d.method}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-medium ${statusStyles[d.status]}`}>
                      {d.status}
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
