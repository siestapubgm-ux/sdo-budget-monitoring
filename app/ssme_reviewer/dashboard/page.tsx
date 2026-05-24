"use client";

import { Activity, Clock, CheckCircle, XCircle, FilePlus, ThumbsUp, Search, BarChart2 } from "lucide-react";

const stats = [
  { label: "For M&E Review",  value: "7",  sub: "DMEA docs pending",        icon: Activity,    color: "blue"  },
  { label: "In Progress",     value: "2",  sub: "currently reviewing",      icon: Clock,       color: "amber" },
  { label: "Reviewed",        value: "21", sub: "cleared this FY",          icon: CheckCircle, color: "green" },
  { label: "Returned",        value: "2",  sub: "sent back for revision",   icon: XCircle,     color: "red"   },
];

const colorMap: Record<string, string> = {
  blue:  "bg-blue-50 text-blue-700 border-blue-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  green: "bg-green-50 text-green-700 border-green-100",
  red:   "bg-red-50 text-red-700 border-red-100",
};

const statusColor: Record<string, string> = {
  "For Review":  "bg-blue-50 text-blue-700",
  "In Progress": "bg-amber-50 text-amber-700",
  "Reviewed":    "bg-green-50 text-green-700",
  "Returned":    "bg-red-50 text-red-700",
};

const docs = [
  { ref: "SME-2026-018", title: "Q1 DMEA Accomplishment Report",     submittedBy: "A. Reyes",   status: "Reviewed",    date: "May 8"  },
  { ref: "SME-2026-019", title: "School Monitoring Visit Summary",   submittedBy: "C. Basa",    status: "For Review",  date: "May 18" },
  { ref: "SME-2026-020", title: "Dropout Rate Monitoring Q2",        submittedBy: "M. Torres",  status: "In Progress", date: "May 17" },
  { ref: "SME-2026-021", title: "ALS Learner Tracking Report",       submittedBy: "J. Lim",     status: "Returned",    date: "May 14" },
  { ref: "SME-2026-022", title: "SPED Inclusion Monitoring Sheet",   submittedBy: "P. Garcia",  status: "For Review",  date: "May 20" },
];

const quickActions = [
  { label: "New Review",    icon: FilePlus  },
  { label: "Approve",       icon: ThumbsUp  },
  { label: "Search Docs",   icon: Search    },
  { label: "M&E Reports",   icon: BarChart2 },
];

export default function SMMEReviewerDashboard() {
  return (
    <main className="p-4 sm:p-6 space-y-6">

      <div>
        <h2 className="text-[15px] font-semibold text-gray-900">SMM&E Review Queue</h2>
        <p className="text-[12px] text-gray-400 mt-0.5">Monitoring, evaluation and DMEA review · FY 2026</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-gray-500">{s.label}</span>
              <span className={`w-7 h-7 flex items-center justify-center rounded-md border ${colorMap[s.color]}`}>
                <s.icon className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-[22px] font-semibold text-gray-900 leading-none">{s.value}</p>
            <p className="text-[11px] text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-gray-800">M&E Document Queue</span>
            <span className="text-[11px] text-blue-600 cursor-pointer hover:underline">View all</span>
          </div>
          <div className="divide-y divide-gray-50">
            {docs.map((d) => (
              <div key={d.ref} className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-400 font-mono">{d.ref}</p>
                  <p className="text-[12px] font-medium text-gray-800 truncate">{d.title}</p>
                  <p className="text-[11px] text-gray-400">by {d.submittedBy}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[d.status]}`}>{d.status}</span>
                  <span className="text-[10px] text-gray-300">{d.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="text-[13px] font-semibold text-gray-800">Quick Actions</span>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {quickActions.map((q) => (
              <button key={q.label}
                className="flex flex-col items-center gap-1.5 p-3 rounded-md border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-colors text-center"
              >
                <q.icon className="w-4 h-4 text-gray-500" />
                <span className="text-[11px] text-gray-600 leading-tight">{q.label}</span>
              </button>
            ))}
          </div>
          <div className="px-4 pb-4">
            <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
              <p className="text-[11px] font-semibold text-blue-700">7 docs for review</p>
              <p className="text-[11px] text-blue-600 mt-0.5">SME-2026-021 was returned. Coordinate with Program Owner for resubmission.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
