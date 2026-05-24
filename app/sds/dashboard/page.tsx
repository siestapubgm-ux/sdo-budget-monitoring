"use client";

import { useState } from "react";
import {
  Award, Clock, CheckCircle, XCircle,
  ThumbsUp, ThumbsDown, Eye, BarChart2,
  X, ChevronRight, Download, AlertTriangle,
} from "lucide-react";

const colorMap = {
  blue:  "bg-blue-50 text-blue-700 border-blue-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  green: "bg-green-50 text-green-700 border-green-100",
  red:   "bg-red-50 text-red-700 border-red-100",
};

const statusColor = {
  "For Approval": "bg-blue-50 text-blue-700",
  "In Review":    "bg-amber-50 text-amber-700",
  "Approved":     "bg-green-50 text-green-700",
  "Returned":     "bg-red-50 text-red-700",
};

const typeColor = {
  PPA: "bg-purple-50 text-purple-700",
  ORS: "bg-teal-50 text-teal-700",
  DV:  "bg-orange-50 text-orange-700",
};

const RETURN_REASONS = [
  "Incomplete supporting documents",
  "Budget line mismatch",
  "Requires ASDS re-endorsement",
  "Incorrect computation / amount",
  "Policy / legal compliance issue",
  "Other",
];

const initialQueue = [
  { ref: "PPA-2026-003", title: "ALS Mobile Teacher Deployment",      type: "PPA", recommendedBy: "ASDS", status: "For Approval", date: "May 19", amount: null        },
  { ref: "ORS-2026-041", title: "Obligation for SHS Supplies",        type: "ORS", recommendedBy: "ASDS", status: "In Review",    date: "May 18", amount: "₱ 245,000" },
  { ref: "DV-2026-030",  title: "Honoraria — LAC Session Speakers",   type: "DV",  recommendedBy: "ASDS", status: "Approved",     date: "May 14", amount: "₱ 18,500"  },
  { ref: "DV-2026-031",  title: "Travel Expenses — Division Meeting", type: "DV",  recommendedBy: "ASDS", status: "For Approval", date: "May 20", amount: "₱ 12,200"  },
  { ref: "PPA-2026-009", title: "Digital Literacy for Teachers",      type: "PPA", recommendedBy: "ASDS", status: "Returned",     date: "May 16", amount: null        },
];

const summary = [
  { label: "Total Budget Allocated", value: "₱ 12,450,000", sub: "FY 2026 GAA"       },
  { label: "Total Obligated",        value: "₱ 8,320,500",  sub: "67% of allocation" },
  { label: "Total Disbursed",        value: "₱ 5,110,200",  sub: "41% of allocation" },
  { label: "Remaining Balance",      value: "₱ 4,129,500",  sub: "unobligated"       },
];

/* ── Shared ── */
function Toast({ message, type, visible }) {
  if (!visible) return null;
  const colors = {
    green: "bg-green-50 text-green-700 border-green-200",
    red:   "bg-red-50 text-red-700 border-red-200",
    blue:  "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg border text-[12px] font-medium shadow-sm ${colors[type]}`}>
      {message}
    </div>
  );
}

function ModalBackdrop({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

/* ── Approve Modal ── */
function ApproveModal({ queue, selectedRef, onSelect, onApprove, onClose }) {
  const item = selectedRef ? queue.find((q) => q.ref === selectedRef) : null;
  const actionable = queue.filter((q) => q.status === "For Approval" || q.status === "In Review");

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[420px] max-w-[95vw] shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-green-600" /> Approve Document
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4">
          {item ? (
            <div className="space-y-3">
              <div><p className="text-[11px] text-gray-400 mb-1">Reference</p><p className="text-[12px] font-mono text-gray-700">{item.ref}</p></div>
              <div><p className="text-[11px] text-gray-400 mb-1">Title</p><p className="text-[13px] font-medium text-gray-800">{item.title}</p></div>
              <div><p className="text-[11px] text-gray-400 mb-1">Recommended by</p><p className="text-[12px] text-gray-700">{item.recommendedBy}</p></div>
              {item.amount && <div><p className="text-[11px] text-gray-400 mb-1">Amount</p><p className="text-[13px] font-semibold text-gray-800">{item.amount}</p></div>}
              <div><p className="text-[11px] text-gray-400 mb-1">Current status</p>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[item.status]}`}>{item.status}</span>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                <p className="text-[11px] text-green-700 font-medium">Confirm SDS approval</p>
                <p className="text-[11px] text-green-600 mt-1">Your signature finalizes this document for implementation/disbursement.</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[12px] text-gray-400 mb-3">No item selected. Choose one to approve:</p>
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {actionable.map((q) => (
                  <button key={q.ref} onClick={() => onSelect(q.ref)}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${typeColor[q.type]}`}>{q.type}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium text-gray-800 truncate">{q.title}</p>
                      <p className="text-[11px] text-gray-400">{q.recommendedBy}{q.amount ? ` · ${q.amount}` : ""}</p>
                    </div>
                    <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
                  </button>
                ))}
                {actionable.length === 0 && <p className="text-[12px] text-gray-400 text-center py-4">No actionable items.</p>}
              </div>
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
          {item && (
            <button onClick={() => onApprove(item.ref)}
              className="px-3 py-1.5 text-[12px] rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 flex items-center gap-1.5">
              <ThumbsUp className="w-3.5 h-3.5" /> Confirm Approval
            </button>
          )}
        </div>
      </div>
    </ModalBackdrop>
  );
}

/* ── Return Modal ── */
function ReturnModal({ queue, selectedRef, onSelect, onReturn, onClose }) {
  const [reason, setReason] = useState("");
  const [notes, setNotes]   = useState("");
  const item = selectedRef ? queue.find((q) => q.ref === selectedRef) : null;
  const returnable = queue.filter((q) => q.status !== "Returned" && q.status !== "Approved");

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[420px] max-w-[95vw] shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <ThumbsDown className="w-4 h-4 text-red-500" /> Return Document
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4">
          {item ? (
            <div className="space-y-3">
              <div><p className="text-[11px] text-gray-400 mb-1">Reference</p><p className="text-[12px] font-mono text-gray-700">{item.ref}</p></div>
              <div><p className="text-[11px] text-gray-400 mb-1">Title</p><p className="text-[13px] font-medium text-gray-800">{item.title}</p></div>
              <div>
                <p className="text-[11px] text-gray-400 mb-1">Return reason</p>
                <select
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-[12px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white"
                  value={reason} onChange={(e) => setReason(e.target.value)}
                >
                  <option value="">Select a reason…</option>
                  {RETURN_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 mb-1">Remarks / instructions</p>
                <textarea
                  className="w-full border border-gray-200 rounded-lg p-2 text-[12px] text-gray-800 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
                  rows={3} placeholder="Provide specific instructions for correction…"
                  value={notes} onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                <p className="text-[11px] text-amber-700 font-medium flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> This action will send the document back.</p>
                <p className="text-[11px] text-amber-600 mt-1">The submitting office will be notified to correct and re-submit.</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[12px] text-gray-400 mb-3">No item selected. Choose one to return:</p>
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {returnable.map((q) => (
                  <button key={q.ref} onClick={() => onSelect(q.ref)}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${typeColor[q.type]}`}>{q.type}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium text-gray-800 truncate">{q.title}</p>
                      <p className="text-[11px] text-gray-400">{q.recommendedBy}</p>
                    </div>
                    <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
                  </button>
                ))}
                {returnable.length === 0 && <p className="text-[12px] text-gray-400 text-center py-4">No returnable items.</p>}
              </div>
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
          {item && (
            <button onClick={() => onReturn(item.ref, reason, notes)} disabled={!reason}
              className={`px-3 py-1.5 text-[12px] rounded-lg flex items-center gap-1.5 border ${reason ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100" : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"}`}>
              <ThumbsDown className="w-3.5 h-3.5" /> Confirm Return
            </button>
          )}
        </div>
      </div>
    </ModalBackdrop>
  );
}

/* ── View All Modal ── */
function ViewAllModal({ queue, onClose }) {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "For Approval", "In Review", "Approved", "Returned"];
  const filtered = filter === "All" ? queue : queue.filter((q) => q.status === filter);

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[560px] max-w-[95vw] shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-500" /> All Documents
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-4 pt-3 pb-1 flex gap-1.5 flex-wrap">
          {statuses.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-2.5 py-1 text-[11px] rounded-full border transition-colors ${filter === s ? "bg-gray-800 text-white border-gray-800" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="p-4 space-y-1.5 max-h-80 overflow-y-auto">
          {filtered.length > 0 ? filtered.map((q) => (
            <div key={q.ref} className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-100 hover:bg-gray-50">
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ${typeColor[q.type]}`}>{q.type}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-mono text-gray-400">{q.ref}</p>
                <p className="text-[12px] font-medium text-gray-800 truncate">{q.title}</p>
                <p className="text-[11px] text-gray-400">
                  Rec. by {q.recommendedBy}
                  {q.amount && <span className="ml-1.5 font-medium text-gray-600">{q.amount}</span>}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[q.status]}`}>{q.status}</span>
                <span className="text-[10px] text-gray-300">{q.date}</span>
              </div>
            </div>
          )) : (
            <p className="text-[12px] text-gray-400 text-center py-6">No documents found for this filter.</p>
          )}
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
          <p className="text-[11px] text-gray-400">{filtered.length} of {queue.length} documents shown</p>
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Close</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

/* ── Reports Modal ── */
function ReportsModal({ queue, onClose }) {
  const total    = queue.length;
  const approved = queue.filter((q) => q.status === "Approved").length;
  const returned = queue.filter((q) => q.status === "Returned").length;
  const pending  = queue.filter((q) => q.status === "For Approval").length;
  const inReview = queue.filter((q) => q.status === "In Review").length;
  const rate     = total > 0 ? Math.round((approved / total) * 100) : 0;

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[440px] max-w-[95vw] shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-gray-500" /> Executive Report · FY 2026
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Approved",       value: approved, cls: "bg-green-50 border-green-100 text-green-700" },
              { label: "Returned",       value: returned, cls: "bg-red-50 border-red-100 text-red-700"       },
              { label: "For Approval",   value: pending,  cls: "bg-blue-50 border-blue-100 text-blue-700"   },
              { label: "In Review",      value: inReview, cls: "bg-amber-50 border-amber-100 text-amber-700" },
            ].map((s) => (
              <div key={s.label} className={`border rounded-lg p-3 ${s.cls}`}>
                <p className="text-[11px] font-medium">{s.label}</p>
                <p className="text-[24px] font-semibold mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[11px] text-gray-400 mb-1.5">Approval rate</p>
            <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-green-500 h-full rounded-full" style={{ width: `${rate}%` }} />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">{rate}% of {total} items approved</p>
          </div>

          <div className="border border-gray-100 rounded-lg p-3 bg-gray-50">
            <p className="text-[11px] text-gray-400 mb-1">Budget utilization</p>
            <div className="space-y-1.5">
              {[
                { label: "Total Allocated", value: "₱ 12,450,000" },
                { label: "Total Obligated", value: "₱ 8,320,500"  },
                { label: "Total Disbursed", value: "₱ 5,110,200"  },
                { label: "Balance",         value: "₱ 4,129,500"  },
              ].map((b) => (
                <div key={b.label} className="flex justify-between text-[12px]">
                  <span className="text-gray-500">{b.label}</span>
                  <span className="font-medium text-gray-800">{b.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-1.5">
            {["PPA", "ORS", "DV"].map((t) => (
              <div key={t} className="flex items-center justify-between text-[12px]">
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${typeColor[t]}`}>{t}</span>
                <span className="text-gray-500">{queue.filter((q) => q.type === t).length} items</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Close</button>
          <button onClick={onClose}
            className="px-3 py-1.5 text-[12px] rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

/* ── Main Dashboard ── */
export default function SDSDashboard() {
  const [queue, setQueue]          = useState(initialQueue);
  const [selectedRef, setSelected] = useState(null);
  const [modal, setModal]          = useState(null);
  const [toast, setToast]          = useState({ visible: false, message: "", type: "green" });

  const showToast = (message, type = "green") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  const handleApprove = (ref) => {
    setQueue((prev) => prev.map((q) => q.ref === ref ? { ...q, status: "Approved" } : q));
    setSelected(null);
    setModal(null);
    showToast(`✓ ${ref} approved by SDS`, "green");
  };

  const handleReturn = (ref, reason) => {
    if (!reason) return;
    setQueue((prev) => prev.map((q) => q.ref === ref ? { ...q, status: "Returned" } : q));
    setSelected(null);
    setModal(null);
    showToast(`↩ ${ref} returned: ${reason}`, "red");
  };

  const stats = [
    { label: "For Final Approval", value: queue.filter((q) => q.status === "For Approval").length, sub: "awaiting SDS signature",   icon: Award,       color: "blue"  },
    { label: "In Review",          value: queue.filter((q) => q.status === "In Review").length,     sub: "currently reviewing",      icon: Clock,       color: "amber" },
    { label: "Approved",           value: queue.filter((q) => q.status === "Approved").length,      sub: "finalized this FY",        icon: CheckCircle, color: "green" },
    { label: "Returned",           value: queue.filter((q) => q.status === "Returned").length,      sub: "sent back for correction", icon: XCircle,     color: "red"   },
  ];

  const returnedItems = queue.filter((q) => q.status === "Returned");
  const forApproval   = queue.filter((q) => q.status === "For Approval").length;

  const quickActions = [
    { label: "Approve",    icon: ThumbsUp,   key: "approve",  hoverCls: "hover:bg-green-50 hover:border-green-200 hover:text-green-700" },
    { label: "Return",     icon: ThumbsDown, key: "return",   hoverCls: "hover:bg-red-50 hover:border-red-200 hover:text-red-700"       },
    { label: "View All",   icon: Eye,        key: "viewall",  hoverCls: "hover:bg-gray-50 hover:border-gray-200"                        },
    { label: "Reports",    icon: BarChart2,  key: "reports",  hoverCls: "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"    },
  ];

  return (
    <main className="p-4 sm:p-6 space-y-6">
      <div>
        <h2 className="text-[15px] font-semibold text-gray-900">SDS Executive Dashboard</h2>
        <p className="text-[12px] text-gray-400 mt-0.5">Final approval authority · SDO Cagayan · FY 2026</p>
      </div>

      {/* Approval Stats */}
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

      {/* Budget Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summary.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-[11px] font-medium text-gray-500 mb-1">{s.label}</p>
            <p className="text-[16px] font-semibold text-gray-900 leading-tight">{s.value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Queue */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-gray-800">Final Approval Queue</span>
            <button onClick={() => setModal("viewall")} className="text-[11px] text-blue-600 hover:underline">View all</button>
          </div>
          <div className="divide-y divide-gray-50">
            {queue.map((q) => (
              <div
                key={q.ref}
                onClick={() => setSelected(selectedRef === q.ref ? null : q.ref)}
                className={`px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                  selectedRef === q.ref ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <div className="min-w-0 flex items-start gap-2">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 ${typeColor[q.type]}`}>{q.type}</span>
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-400 font-mono">{q.ref}</p>
                    <p className="text-[12px] font-medium text-gray-800 truncate">{q.title}</p>
                    <p className="text-[11px] text-gray-400">
                      Recommended by {q.recommendedBy}
                      {q.amount && <span className="ml-2 font-medium text-gray-600">{q.amount}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[q.status]}`}>{q.status}</span>
                  <span className="text-[10px] text-gray-300">{q.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Inline action bar when a row is selected */}
          {selectedRef && (
            <div className="px-4 py-2.5 border-t border-blue-100 bg-blue-50 flex items-center justify-between">
              <p className="text-[11px] text-blue-600">
                Selected: <span className="font-mono font-semibold">{selectedRef}</span>
              </p>
              <div className="flex gap-2">
                <button onClick={() => setModal("approve")}
                  className="px-2.5 py-1 text-[11px] rounded-md bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" /> Approve
                </button>
                <button onClick={() => setModal("return")}
                  className="px-2.5 py-1 text-[11px] rounded-md bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 flex items-center gap-1">
                  <ThumbsDown className="w-3 h-3" /> Return
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions + Status Summary */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="text-[13px] font-semibold text-gray-800">Quick Actions</span>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {quickActions.map((a) => (
              <button key={a.label} onClick={() => setModal(a.key)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-md border border-gray-100 transition-colors text-center text-gray-500 ${a.hoverCls}`}>
                <a.icon className="w-4 h-4" />
                <span className="text-[11px] leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
          <div className="px-4 pb-4 space-y-2">
            <div className={`border rounded-md p-3 ${forApproval > 0 ? "bg-blue-50 border-blue-100" : "bg-green-50 border-green-100"}`}>
              <p className={`text-[11px] font-semibold ${forApproval > 0 ? "text-blue-700" : "text-green-700"}`}>
                {forApproval > 0 ? `${forApproval} item${forApproval > 1 ? "s" : ""} for final approval` : "No pending approvals"}
              </p>
              <p className={`text-[11px] mt-0.5 ${forApproval > 0 ? "text-blue-600" : "text-green-600"}`}>
                {forApproval > 0 ? "All recommended by ASDS and ready for your signature." : "All items have been actioned."}
              </p>
            </div>
            {returnedItems.length > 0 ? (
              <div className="bg-red-50 border border-red-100 rounded-md p-3">
                <p className="text-[11px] font-semibold text-red-700">{returnedItems.length} returned item{returnedItems.length > 1 ? "s" : ""}</p>
                <p className="text-[11px] text-red-600 mt-0.5">
                  {returnedItems.map((d) => d.ref).join(", ")} sent back for correction.
                </p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-100 rounded-md p-3">
                <p className="text-[11px] font-semibold text-green-700">Budget utilization: 67%</p>
                <p className="text-[11px] text-green-600 mt-0.5">On track for FY 2026 targets.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === "approve"  && <ApproveModal  queue={queue} selectedRef={selectedRef} onSelect={setSelected} onApprove={handleApprove} onClose={() => setModal(null)} />}
      {modal === "return"   && <ReturnModal   queue={queue} selectedRef={selectedRef} onSelect={setSelected} onReturn={handleReturn}   onClose={() => setModal(null)} />}
      {modal === "viewall"  && <ViewAllModal  queue={queue}                                                                            onClose={() => setModal(null)} />}
      {modal === "reports"  && <ReportsModal  queue={queue}                                                                            onClose={() => setModal(null)} />}

      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </main>
  );
}