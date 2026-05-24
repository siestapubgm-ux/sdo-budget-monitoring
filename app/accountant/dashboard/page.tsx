"use client";

import { useState } from "react";
import {
  Calculator, Clock, CheckCircle, XCircle,
  Search, FileCheck, BarChart2, AlertCircle,
  X, Check, Download, ChevronRight,
} from "lucide-react";

const initialQueue = [
  { ref: "ORS-2026-041", title: "Obligation for SHS Supplies",        type: "ORS", submittedBy: "E. Bancud",    status: "For Validation",  date: "May 18", amount: "₱48,500.00" },
  { ref: "DV-2026-029",  title: "Payment — School Feeding Caterer",   type: "DV",  submittedBy: "J. Dela Cruz", status: "In Progress",     date: "May 17", amount: "₱125,000.00" },
  { ref: "DV-2026-030",  title: "Honoraria — LAC Session Speakers",   type: "DV",  submittedBy: "R. Santos",    status: "Validated",       date: "May 14", amount: "₱32,000.00" },
  { ref: "ORS-2026-039", title: "Obligation for Brigada Eskwela",     type: "ORS", submittedBy: "A. Reyes",     status: "With Deficiency", date: "May 12", amount: "₱18,750.00" },
  { ref: "DV-2026-031",  title: "Travel Expenses — Division Meeting", type: "DV",  submittedBy: "T. Ramos",     status: "For Validation",  date: "May 20", amount: "₱9,200.00" },
  { ref: "ORS-2026-042", title: "Obligation for Science Equipment",   type: "ORS", submittedBy: "C. Basa",      status: "For Validation",  date: "May 19", amount: "₱67,300.00" },
  { ref: "DV-2026-032",  title: "Payment — Printing Services",        type: "DV",  submittedBy: "M. Torres",    status: "In Progress",     date: "May 16", amount: "₱14,400.00" },
  { ref: "ORS-2026-040", title: "Obligation for MOOE Utilities",      type: "ORS", submittedBy: "D. Viray",     status: "Validated",       date: "May 9",  amount: "₱22,000.00" },
];

const colorMap = {
  blue:  "bg-blue-50 text-blue-700 border-blue-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  green: "bg-green-50 text-green-700 border-green-100",
  red:   "bg-red-50 text-red-700 border-red-100",
};

const statusColor = {
  "For Validation":  "bg-blue-50 text-blue-700",
  "In Progress":     "bg-amber-50 text-amber-700",
  "Validated":       "bg-green-50 text-green-700",
  "With Deficiency": "bg-red-50 text-red-700",
};

const typeColor = {
  ORS: "bg-teal-50 text-teal-700",
  DV:  "bg-orange-50 text-orange-700",
};

const DEFICIENCY_TYPES = [
  "Missing supporting documents",
  "Budget line mismatch",
  "Incomplete signatories",
  "Incorrect amount / computation error",
  "Expired obligation slip",
  "Other",
];

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

function ValidateModal({ queue, selectedRef, onSelect, onValidate, onClose }) {
  const item = selectedRef ? queue.find((q) => q.ref === selectedRef) : null;
  const actionable = queue.filter((q) => q.status === "For Validation" || q.status === "In Progress");

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[420px] max-w-[95vw] shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-green-600" /> Validate Document
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4">
          {item ? (
            <div className="space-y-3">
              <div><p className="text-[11px] text-gray-400 mb-1">Reference</p><p className="text-[12px] font-mono text-gray-700">{item.ref}</p></div>
              <div><p className="text-[11px] text-gray-400 mb-1">Title</p><p className="text-[13px] font-medium text-gray-800">{item.title}</p></div>
              <div><p className="text-[11px] text-gray-400 mb-1">Submitted by</p><p className="text-[12px] text-gray-700">{item.submittedBy}</p></div>
              <div><p className="text-[11px] text-gray-400 mb-1">Amount</p><p className="text-[13px] font-semibold text-gray-800">{item.amount}</p></div>
              <div><p className="text-[11px] text-gray-400 mb-1">Current status</p>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[item.status]}`}>{item.status}</span>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                <p className="text-[11px] text-green-700 font-medium">Confirm financial validation</p>
                <p className="text-[11px] text-green-600 mt-1">This certifies that the document has been reviewed and is cleared for further processing.</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[12px] text-gray-400 mb-3">No item selected. Choose one to validate:</p>
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {actionable.map((q) => (
                  <button key={q.ref} onClick={() => onSelect(q.ref)}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${typeColor[q.type]}`}>{q.type}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium text-gray-800 truncate">{q.title}</p>
                      <p className="text-[11px] text-gray-400">{q.submittedBy} · {q.amount}</p>
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
            <button onClick={() => onValidate(item.ref)}
              className="px-3 py-1.5 text-[12px] rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Confirm Validation
            </button>
          )}
        </div>
      </div>
    </ModalBackdrop>
  );
}

function DeficiencyModal({ queue, selectedRef, onSelect, onFlag, onClose }) {
  const [defType, setDefType] = useState("");
  const [notes, setNotes] = useState("");
  const item = selectedRef ? queue.find((q) => q.ref === selectedRef) : null;
  const canFlag = queue.filter((q) => q.status !== "With Deficiency" && q.status !== "Validated");

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[420px] max-w-[95vw] shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" /> Flag Deficiency
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4">
          {item ? (
            <div className="space-y-3">
              <div><p className="text-[11px] text-gray-400 mb-1">Reference</p><p className="text-[12px] font-mono text-gray-700">{item.ref}</p></div>
              <div><p className="text-[11px] text-gray-400 mb-1">Title</p><p className="text-[13px] font-medium text-gray-800">{item.title}</p></div>
              <div>
                <p className="text-[11px] text-gray-400 mb-1">Deficiency type</p>
                <select
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-[12px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white"
                  value={defType} onChange={(e) => setDefType(e.target.value)}
                >
                  <option value="">Select deficiency type…</option>
                  {DEFICIENCY_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 mb-1">Additional notes</p>
                <textarea
                  className="w-full border border-gray-200 rounded-lg p-2 text-[12px] text-gray-800 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
                  rows={3} placeholder="Describe the issue in detail…"
                  value={notes} onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[12px] text-gray-400 mb-3">No item selected. Choose one to flag:</p>
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {canFlag.map((q) => (
                  <button key={q.ref} onClick={() => onSelect(q.ref)}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${typeColor[q.type]}`}>{q.type}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium text-gray-800 truncate">{q.title}</p>
                      <p className="text-[11px] text-gray-400">{q.submittedBy}</p>
                    </div>
                    <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
          {item && (
            <button onClick={() => onFlag(item.ref, defType, notes)} disabled={!defType}
              className={`px-3 py-1.5 text-[12px] rounded-lg flex items-center gap-1.5 border ${defType ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100" : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"}`}>
              <AlertCircle className="w-3.5 h-3.5" /> Flag Deficiency
            </button>
          )}
        </div>
      </div>
    </ModalBackdrop>
  );
}

function SearchModal({ queue, onClose }) {
  const [query, setQuery] = useState("");
  const results = query.trim().length > 1
    ? queue.filter((q) =>
        q.ref.toLowerCase().includes(query.toLowerCase()) ||
        q.title.toLowerCase().includes(query.toLowerCase()) ||
        q.submittedBy.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[520px] max-w-[95vw] shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" /> Search Records
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 mb-4 focus-within:ring-1 focus-within:ring-gray-300">
            <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <input
              autoFocus
              className="flex-1 text-[12px] text-gray-800 outline-none bg-transparent placeholder-gray-300"
              placeholder="Search by reference, title, or submitted by…"
              value={query} onChange={(e) => setQuery(e.target.value)}
            />
            {query && <button onClick={() => setQuery("")} className="text-gray-300 hover:text-gray-500"><X className="w-3 h-3" /></button>}
          </div>
          {query.trim().length > 1 ? (
            results.length > 0 ? (
              <div className="space-y-1">
                {results.map((q) => (
                  <div key={q.ref} className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-100 hover:bg-gray-50">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ${typeColor[q.type]}`}>{q.type}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-mono text-gray-400">{q.ref}</p>
                      <p className="text-[12px] font-medium text-gray-800 truncate">{q.title}</p>
                      <p className="text-[11px] text-gray-400">by {q.submittedBy} · {q.amount}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${statusColor[q.status]}`}>{q.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[13px] text-gray-400">No records found for "{query}"</p>
              </div>
            )
          ) : (
            <div className="text-center py-6">
              <p className="text-[12px] text-gray-300">Type at least 2 characters to search</p>
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Close</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

function ReportsModal({ queue, onClose }) {
  const total      = queue.length;
  const validated  = queue.filter((q) => q.status === "Validated").length;
  const deficient  = queue.filter((q) => q.status === "With Deficiency").length;
  const pending    = queue.filter((q) => q.status === "For Validation").length;
  const inProgress = queue.filter((q) => q.status === "In Progress").length;
  const rate       = total > 0 ? Math.round((validated / total) * 100) : 0;
  const totalAmt   = queue.reduce((sum, q) => {
    const n = parseFloat(q.amount.replace(/[₱,]/g, "")) || 0;
    return sum + n;
  }, 0);

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[440px] max-w-[95vw] shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-gray-500" /> Finance Report · FY 2026
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Validated",       value: validated,  cls: "bg-green-50 border-green-100 text-green-700" },
              { label: "With Deficiency", value: deficient,  cls: "bg-red-50 border-red-100 text-red-700"   },
              { label: "For Validation",  value: pending,    cls: "bg-blue-50 border-blue-100 text-blue-700" },
              { label: "In Progress",     value: inProgress, cls: "bg-amber-50 border-amber-100 text-amber-700" },
            ].map((s) => (
              <div key={s.label} className={`border rounded-lg p-3 ${s.cls}`}>
                <p className="text-[11px] font-medium">{s.label}</p>
                <p className="text-[24px] font-semibold mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[11px] text-gray-400 mb-1.5">Validation rate</p>
            <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-green-500 h-full rounded-full" style={{ width: `${rate}%` }} />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">{rate}% of {total} items validated</p>
          </div>

          <div className="border border-gray-100 rounded-lg p-3 bg-gray-50">
            <p className="text-[11px] text-gray-400 mb-0.5">Total amount under review</p>
            <p className="text-[18px] font-semibold text-gray-800">
              ₱{totalAmt.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-1.5">
            {["ORS", "DV"].map((t) => (
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

export default function AccountantDashboard() {
  const [queue, setQueue]         = useState(initialQueue);
  const [selectedRef, setSelected] = useState(null);
  const [modal, setModal]         = useState(null);
  const [toast, setToast]         = useState({ visible: false, message: "", type: "green" });

  const showToast = (message, type = "green") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  const handleValidate = (ref) => {
    setQueue((prev) => prev.map((q) => q.ref === ref ? { ...q, status: "Validated" } : q));
    setSelected(null);
    setModal(null);
    showToast(`✓ ${ref} validated successfully`, "green");
  };

  const handleFlag = (ref, defType, notes) => {
    if (!defType) return;
    setQueue((prev) => prev.map((q) => q.ref === ref ? { ...q, status: "With Deficiency" } : q));
    setSelected(null);
    setModal(null);
    showToast(`⚠ ${ref} flagged: ${defType}`, "red");
  };

  const stats = [
    { label: "For Validation",  value: queue.filter((q) => q.status === "For Validation").length,  sub: "financial docs pending",  icon: Calculator,  color: "blue"  },
    { label: "In Progress",     value: queue.filter((q) => q.status === "In Progress").length,      sub: "currently reviewing",     icon: Clock,       color: "amber" },
    { label: "Validated",       value: queue.filter((q) => q.status === "Validated").length,        sub: "cleared this FY",         icon: CheckCircle, color: "green" },
    { label: "With Deficiency", value: queue.filter((q) => q.status === "With Deficiency").length,  sub: "require correction",      icon: XCircle,     color: "red"   },
  ];

  const deficientItems = queue.filter((q) => q.status === "With Deficiency");
  const displayQueue   = queue.slice(0, 5);

  const quickActions = [
    { label: "Validate",        icon: FileCheck,   key: "validate",    hoverCls: "hover:bg-green-50 hover:border-green-200 hover:text-green-700" },
    { label: "Flag Deficiency", icon: AlertCircle, key: "deficiency",  hoverCls: "hover:bg-red-50 hover:border-red-200 hover:text-red-700"   },
    { label: "Search Records",  icon: Search,      key: "search",      hoverCls: "hover:bg-gray-50 hover:border-gray-200"                     },
    { label: "Finance Report",  icon: BarChart2,   key: "reports",     hoverCls: "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700" },
  ];

  return (
    <main className="p-4 sm:p-6 space-y-6">
      <div>
        <h2 className="text-[15px] font-semibold text-gray-900">Financial Validation Queue</h2>
        <p className="text-[12px] text-gray-400 mt-0.5">Pre-audit and financial validation of ORS & DVs · FY 2026</p>
      </div>

      {/* Stat Cards */}
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

      {/* Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Queue */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-gray-800">Validation Queue</span>
            <button onClick={() => setModal("search")} className="text-[11px] text-blue-600 hover:underline">View all</button>
          </div>
          <div className="divide-y divide-gray-50">
            {displayQueue.map((q) => (
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
                    <p className="text-[11px] text-gray-400">by {q.submittedBy} · {q.amount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[q.status]}`}>{q.status}</span>
                  <span className="text-[10px] text-gray-300">{q.date}</span>
                </div>
              </div>
            ))}
          </div>
          {selectedRef && (
            <div className="px-4 py-2.5 border-t border-blue-100 bg-blue-50 flex items-center justify-between">
              <p className="text-[11px] text-blue-600">
                Selected: <span className="font-mono font-semibold">{selectedRef}</span>
              </p>
              <div className="flex gap-2">
                <button onClick={() => setModal("validate")}
                  className="px-2.5 py-1 text-[11px] rounded-md bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Validate
                </button>
                <button onClick={() => setModal("deficiency")}
                  className="px-2.5 py-1 text-[11px] rounded-md bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Flag
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
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
          <div className="px-4 pb-4">
            {deficientItems.length === 0 ? (
              <div className="bg-green-50 border border-green-100 rounded-md p-3">
                <p className="text-[11px] font-semibold text-green-700">No deficiencies</p>
                <p className="text-[11px] text-green-600 mt-0.5">All items are in good standing.</p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-md p-3">
                <p className="text-[11px] font-semibold text-red-700">{deficientItems.length} deficiencie{deficientItems.length > 1 ? "s" : ""} found</p>
                <p className="text-[11px] text-red-600 mt-0.5">
                  {deficientItems.map((d) => d.ref).join(", ")} require{deficientItems.length === 1 ? "s" : ""} correction.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === "validate"   && <ValidateModal   queue={queue} selectedRef={selectedRef} onSelect={setSelected} onValidate={handleValidate} onClose={() => setModal(null)} />}
      {modal === "deficiency" && <DeficiencyModal queue={queue} selectedRef={selectedRef} onSelect={setSelected} onFlag={handleFlag}         onClose={() => setModal(null)} />}
      {modal === "search"     && <SearchModal     queue={queue}                                                        onClose={() => setModal(null)} />}
      {modal === "reports"    && <ReportsModal    queue={queue}                                                        onClose={() => setModal(null)} />}

      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </main>
  );
}