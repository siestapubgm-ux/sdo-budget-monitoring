"use client";

import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Download } from "lucide-react";

const budgetByMonth = [
  { month: "Jan", allotment: 45, obligation: 38, disbursement: 32 },
  { month: "Feb", allotment: 52, obligation: 44, disbursement: 38 },
  { month: "Mar", allotment: 48, obligation: 42, disbursement: 35 },
  { month: "Apr", allotment: 61, obligation: 55, disbursement: 48 },
  { month: "May", allotment: 55, obligation: 48, disbursement: 42 },
  { month: "Jun", allotment: 67, obligation: 58, disbursement: 52 },
];

const expenseByCategory = [
  { name: "Personnel",         value: 245, fill: "#1E3A8A" },
  { name: "Infrastructure",    value: 189, fill: "#2563EB" },
  { name: "Learning Materials",value: 145, fill: "#3B82F6" },
  { name: "Equipment",         value: 127, fill: "#60A5FA" },
  { name: "Maintenance",       value: 94,  fill: "#93C5FD" },
];

const utilizationByDivision = [
  { division: "Main Office", utilized: 92 },
  { division: "District 1",  utilized: 85 },
  { division: "District 2",  utilized: 78 },
  { division: "District 3",  utilized: 88 },
  { division: "District 4",  utilized: 81 },
];

const quarters = [
  { quarter: "Q1 2026", allotment: "₱121.81M", obligation: "82.1%", disbursement: "71.3%", done: true },
  { quarter: "Q2 2026", allotment: "₱121.81M", obligation: "88.5%", disbursement: "75.2%", done: true },
  { quarter: "Q3 2026", allotment: "₱121.81M", obligation: "TBD",   disbursement: "TBD",   done: false },
  { quarter: "Q4 2026", allotment: "₱121.81M", obligation: "TBD",   disbursement: "TBD",   done: false },
];

const initiatives = [
  { title: "School Infrastructure Program",  amount: "₱78.5M",  status: "In Progress", progress: 68 },
  { title: "Teacher Development Initiative", amount: "₱45.2M",  status: "Active",      progress: 85 },
  { title: "Learning Materials Distribution",amount: "₱34.8M",  status: "Completed",   progress: 100 },
  { title: "Digital Learning Ecosystem",     amount: "₱52.1M",  status: "In Progress", progress: 52 },
];

const statusStyles: Record<string, string> = {
  Completed:   "bg-green-100 text-green-800",
  Active:      "bg-blue-100 text-blue-800",
  "In Progress":"bg-amber-100 text-amber-800",
};

const progressColor: Record<string, string> = {
  Completed:    "bg-green-600",
  Active:       "bg-blue-600",
  "In Progress":"bg-amber-500",
};

const divisionBarColor = ["#1E3A8A","#2563EB","#3B82F6","#2563EB","#60A5FA"];

const metrics = [
  { label: "Budget Allotment",   value: "₱487.24M", sub: "FY 2026 Total · GAA",       bar: 100, color: "text-deped-blue",  bg: "bg-deped-blue" },
  { label: "Total Obligated",    value: "₱415.92M", sub: "85.3% Obligation Rate",      bar: 85,  color: "text-green-700",   bg: "bg-green-700" },
  { label: "Total Disbursed",    value: "₱356.18M", sub: "73.1% Disbursement Rate",    bar: 73,  color: "text-blue-700",    bg: "bg-blue-700" },
  { label: "Unutilized Balance", value: "₱71.32M",  sub: "14.6% Remaining",            bar: 15,  color: "text-amber-600",   bg: "bg-amber-500" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-5">

      {/* Page header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-[13px] font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-[11px] text-gray-400 mt-0.5">Budget Performance and Utilization Summaries · FY 2026</p>
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
              <p className="text-[10px] text-gray-400 mt-1">{m.sub}</p>
              <div className="h-[3px] bg-gray-200 rounded-full mt-2">
                <div className={`h-full rounded-full ${m.bg}`} style={{ width: `${m.bar}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Budget trend line chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-[12px] font-semibold text-gray-900 mb-3">Budget Trend (Monthly)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={budgetByMonth} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: "11px", backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }} />
              <Line type="monotone" dataKey="allotment" stroke="#1E3A8A" strokeWidth={2} dot={{ fill: "#1E3A8A", r: 3 }} />
              <Line type="monotone" dataKey="obligation" stroke="#059669" strokeWidth={2} dot={{ fill: "#059669", r: 3 }} />
              <Line type="monotone" dataKey="disbursement" stroke="#2563EB" strokeWidth={2} dot={{ fill: "#2563EB", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense by category pie chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-[12px] font-semibold text-gray-900 mb-3">Expense Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={expenseByCategory} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ₱${value}M`} outerRadius={60} fill="#8884d8" dataKey="value">
                {expenseByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₱${value}M`} contentStyle={{ fontSize: "11px", backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Division utilization bar chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-[12px] font-semibold text-gray-900 mb-3">Utilization by Division</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={utilizationByDivision} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="division" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: "11px", backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }} />
            <Bar dataKey="utilized" fill="#1E3A8A" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quarterly Performance Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-[12px] font-semibold text-gray-900">Quarterly Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase">Quarter</th>
                <th className="px-4 py-2 text-right text-[10px] font-semibold text-gray-600 uppercase">Allotment</th>
                <th className="px-4 py-2 text-right text-[10px] font-semibold text-gray-600 uppercase">Obligation %</th>
                <th className="px-4 py-2 text-right text-[10px] font-semibold text-gray-600 uppercase">Disbursement %</th>
                <th className="px-4 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {quarters.map((q) => (
                <tr key={q.quarter} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2 text-[11px] font-medium text-gray-900">{q.quarter}</td>
                  <td className="px-4 py-2 text-right text-[11px] font-medium text-gray-900">{q.allotment}</td>
                  <td className="px-4 py-2 text-right text-[11px] text-gray-700">{q.obligation}</td>
                  <td className="px-4 py-2 text-right text-[11px] text-gray-700">{q.disbursement}</td>
                  <td className="px-4 py-2 text-center">
                    <span className={`text-[10px] font-medium px-2 py-1 rounded ${q.done ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
                      {q.done ? "Completed" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Major Initiatives */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-[12px] font-semibold text-gray-900">Major Initiatives Status</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {initiatives.map((init) => (
            <div key={init.title} className="px-4 py-3 hover:bg-gray-50">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-[11px] font-medium text-gray-900">{init.title}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{init.amount}</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap ${statusStyles[init.status]}`}>
                  {init.status}
                </span>
              </div>
              <div className="w-full h-[4px] bg-gray-200 rounded-full">
                <div
                  className={`h-full rounded-full ${progressColor[init.status]}`}
                  style={{ width: `${init.progress}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">{init.progress}% complete</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
