"use client";

import { useState } from "react";
import {
  ClipboardCheck, Clock, CheckCircle, XCircle,
  Search, ThumbsUp, ThumbsDown, BarChart2,
  X, ChevronRight, Download, AlertTriangle, Check,
  LayoutGrid, Calendar, User,
} from "lucide-react";

const colorMap = {
  blue:  "bg-blue-50 text-blue-700 border-blue-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  green: "bg-green-50 text-green-700 border-green-100",
  red:   "bg-red-50 text-red-700 border-red-100",
};

const statusColor = {
  "For Review":  "bg-blue-50 text-blue-700",
  "In Progress": "bg-amber-50 text-amber-700",
  "Validated":   "bg-green-50 text-green-700",
  "Returned":    "bg-red-50 text-red-700",
};

const columnConfig = {
  "For Review":  { label: "For Review",  icon: ClipboardCheck, accent: "#3b82f6", bg: "bg-blue-50",  border: "border-blue-200",  text: "text-blue-700",  count: "bg-blue-100 text-blue-700"  },
  "In Progress": { label: "In Progress", icon: Clock,          accent: "#f59e0b", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", count: "bg-amber-100 text-amber-700" },
  "Validated":   { label: "Validated",   icon: CheckCircle,    accent: "#22c55e", bg: "bg-green-50", border: "border-green-200", text: "text-green-700", count: "bg-green-100 text-green-700" },
  "Returned":    { label: "Returned",    icon: XCircle,        accent: "#ef4444", bg: "bg-red-50",   border: "border-red-200",   text: "text-red-700",   count: "bg-red-100 text-red-700"    },
};

const COLUMN_ORDER = ["For Review", "In Progress", "Validated", "Returned"];

const RETURN_REASONS = [
  "Incomplete WFP/CAPA alignment",
  "Missing supporting documents",
  "Incorrect budget breakdown",
  "Objectives not clearly stated",
  "Targets not measurable / SMART",
  "Other",
];

const initialQueue = [
  { code: "PPA-2026-002", title: "Brigada Eskwela Implementation",  owner: "Ana Reyes",  status: "For Review",  submitted: "May 18" },
  { code: "PPA-2026-006", title: "Gulayan sa Paaralan Program",     owner: "Carlo Basa", status: "For Review",  submitted: "May 19" },
  { code: "PPA-2026-007", title: "Literacy Patrol Training",        owner: "Mia Torres", status: "In Progress", submitted: "May 17" },
  { code: "PPA-2026-008", title: "School Health Nutrition Program", owner: "Jon Lim",    status: "Validated",   submitted: "May 12" },
  { code: "PPA-2026-009", title: "Digital Literacy for Teachers",   owner: "Sue Valdez", status: "Returned",    submitted: "May 10" },
];

/* ─── aging helper ─── */
function agingBadge(dateStr) {
  const parts = dateStr.split(" ");
  const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
  const submitted = new Date(2026, months[parts[0]], parseInt(parts[1]));
  const today = new Date(2026, 4, 24);
  const days = Math.floor((today - submitted) / 86400000);
  if (days <= 2) return { label: `${days}d`, cls: "bg-green-50 text-green-600 border border-green-100" };
  if (days <= 5) return { label: `${days}d`, cls: "bg-amber-50 text-amber-600 border border-amber-100" };
  return { label: `${days}d`, cls: "bg-red-50 text-red-600 border border-red-100" };
}

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
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 overflow-y-auto py-8" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

/* ─── KANBAN BOARD MODAL ─── */
function KanbanCard({ item, onAction }) {
  const cfg = columnConfig[item.status];
  const age = agingBadge(item.submitted);
  const canAct = item.status === "For Review" || item.status === "In Progress";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-mono text-gray-400 leading-none">{item.code}</span>
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border flex-shrink-0 ${age.cls}`}>{age.label}</span>
      </div>
      <p className="text-[12px] font-medium text-gray-800 leading-tight">{item.title}</p>
      <div className="flex items-center gap-1 text-[11px] text-gray-400">
        <User className="w-3 h-3" />
        <span>{item.owner}</span>
        <span className="mx-1">·</span>
        <Calendar className="w-3 h-3" />
        <span>{item.submitted}</span>
      </div>
      {canAct && (
        <div className="flex gap-1.5 pt-1 border-t border-gray-100">
          <button
            onClick={() => onAction("validate", item.code)}
            className="flex-1 py-1 text-[10px] rounded bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 flex items-center justify-center gap-1 transition-colors"
          >
            <Check className="w-3 h-3" /> Validate
          </button>
          <button
            onClick={() => onAction("return", item.code)}
            className="flex-1 py-1 text-[10px] rounded bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 flex items-center justify-center gap-1 transition-colors"
          >
            <ThumbsDown className="w-3 h-3" /> Return
          </button>
        </div>
      )}
    </div>
  );
}

function KanbanModal({ queue, onClose, onOpenModal, onSelectRef }) {
  const [filter, setFilter] = useState("all");
  const owners = [...new Set(queue.map((q) => q.owner))];

  const filtered = filter === "all" ? queue : queue.filter((q) => q.owner === filter);

  function handleAction(type, code) {
    onSelectRef(code);
    onClose();
    onOpenModal(type);
  }

  const totalPending = queue.filter((q) => q.status === "For Review" || q.status === "In Progress").length;
  const validationRate = Math.round((queue.filter((q) => q.status === "Validated").length / queue.length) * 100);

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[760px] max-w-[95vw] shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-gray-900">Review Board · FY 2026</h2>
              <p className="text-[11px] text-gray-400">
                {totalPending} pending · {validationRate}% validation rate
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="text-[11px] border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-300"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All owners</option>
              {owners.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Aging legend */}
        <div className="px-5 py-2 border-b border-gray-100 flex items-center gap-4 bg-white">
          <span className="text-[11px] text-gray-400 font-medium">Age indicator:</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100">≤2d on track</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">3–5d review soon</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">6d+ overdue</span>
        </div>

        {/* Kanban columns */}
        <div className="p-4 overflow-x-auto">
          <div className="flex gap-3 min-w-[640px]">
            {COLUMN_ORDER.map((status) => {
              const cfg = columnConfig[status];
              const Icon = cfg.icon;
              const items = filtered.filter((q) => q.status === status);
              return (
                <div key={status} className="flex-1 min-w-[150px]">
                  {/* Column header */}
                  <div className={`flex items-center justify-between px-3 py-2 rounded-t-lg border ${cfg.border} ${cfg.bg} mb-0`}>
                    <div className={`flex items-center gap-1.5 ${cfg.text}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-semibold">{cfg.label}</span>
                    </div>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${cfg.count}`}>
                      {items.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className={`border-x border-b ${cfg.border} rounded-b-lg p-2 space-y-2 min-h-[180px] bg-gray-50/50`}>
                    {items.length > 0 ? (
                      items.map((item) => (
                        <KanbanCard key={item.code} item={item} onAction={handleAction} />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[120px] opacity-40">
                        <Icon className={`w-6 h-6 mb-1 ${cfg.text}`} />
                        <p className="text-[11px] text-gray-400">Empty</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {COLUMN_ORDER.map((status) => {
              const cfg = columnConfig[status];
              const count = queue.filter((q) => q.status === status).length;
              return (
                <span key={status} className="flex items-center gap-1 text-[11px] text-gray-500">
                  <span className={`w-2 h-2 rounded-full inline-block`} style={{ background: cfg.accent }} />
                  {count} {cfg.label}
                </span>
              );
            })}
          </div>
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-colors">
            Close
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}


/* ── Validate Modal ── */
function ValidateModal({ queue, selectedRef, onSelect, onValidate, onClose }) {
  const item = selectedRef ? queue.find((q) => q.code === selectedRef) : null;
  const actionable = queue.filter((q) => q.status === "For Review" || q.status === "In Progress");

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[420px] max-w-[95vw] shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-green-600" /> Validate Document
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4">
          {item ? (
            <div className="space-y-3">
              <div><p className="text-[11px] text-gray-400 mb-1">Code</p><p className="text-[12px] font-mono text-gray-700">{item.code}</p></div>
              <div><p className="text-[11px] text-gray-400 mb-1">Title</p><p className="text-[13px] font-medium text-gray-800">{item.title}</p></div>
              <div><p className="text-[11px] text-gray-400 mb-1">Owner</p><p className="text-[12px] text-gray-700">{item.owner}</p></div>
              <div><p className="text-[11px] text-gray-400 mb-1">Submitted</p><p className="text-[12px] text-gray-700">{item.submitted}</p></div>
              <div><p className="text-[11px] text-gray-400 mb-1">Current status</p>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[item.status]}`}>{item.status}</span>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                <p className="text-[11px] text-green-700 font-medium">Confirm PMT validation</p>
                <p className="text-[11px] text-green-600 mt-1">This certifies that the WFP/CAPA alignment has been reviewed and the document is cleared for further processing.</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[12px] text-gray-400 mb-3">No item selected. Choose one to validate:</p>
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {actionable.map((q) => (
                  <button key={q.code} onClick={() => onSelect(q.code)}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-mono text-gray-400">{q.code}</p>
                      <p className="text-[12px] font-medium text-gray-800 truncate">{q.title}</p>
                      <p className="text-[11px] text-gray-400">by {q.owner}</p>
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
            <button onClick={() => onValidate(item.code)}
              className="px-3 py-1.5 text-[12px] rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Confirm Validation
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
  const item = selectedRef ? queue.find((q) => q.code === selectedRef) : null;
  const returnable = queue.filter((q) => q.status !== "Returned" && q.status !== "Validated");

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
              <div><p className="text-[11px] text-gray-400 mb-1">Code</p><p className="text-[12px] font-mono text-gray-700">{item.code}</p></div>
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
                  rows={3} placeholder="Provide specific instructions for revision…"
                  value={notes} onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                <p className="text-[11px] text-amber-700 font-medium flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> The owner will be notified to revise and re-submit.</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[12px] text-gray-400 mb-3">No item selected. Choose one to return:</p>
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {returnable.map((q) => (
                  <button key={q.code} onClick={() => onSelect(q.code)}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-mono text-gray-400">{q.code}</p>
                      <p className="text-[12px] font-medium text-gray-800 truncate">{q.title}</p>
                      <p className="text-[11px] text-gray-400">by {q.owner}</p>
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
            <button onClick={() => onReturn(item.code, reason, notes)} disabled={!reason}
              className={`px-3 py-1.5 text-[12px] rounded-lg flex items-center gap-1.5 border ${reason ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100" : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"}`}>
              <ThumbsDown className="w-3.5 h-3.5" /> Confirm Return
            </button>
          )}
        </div>
      </div>
    </ModalBackdrop>
  );
}

/* ── Reports Modal ── */
function ReportsModal({ queue, onClose }) {
  const total      = queue.length;
  const validated  = queue.filter((q) => q.status === "Validated").length;
  const returned   = queue.filter((q) => q.status === "Returned").length;
  const forReview  = queue.filter((q) => q.status === "For Review").length;
  const inProgress = queue.filter((q) => q.status === "In Progress").length;
  const rate       = total > 0 ? Math.round((validated / total) * 100) : 0;

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[440px] max-w-[95vw] shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-gray-500" /> PMT Report · FY 2026
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Validated",   value: validated,  cls: "bg-green-50 border-green-100 text-green-700"  },
              { label: "Returned",    value: returned,   cls: "bg-red-50 border-red-100 text-red-700"        },
              { label: "For Review",  value: forReview,  cls: "bg-blue-50 border-blue-100 text-blue-700"     },
              { label: "In Progress", value: inProgress, cls: "bg-amber-50 border-amber-100 text-amber-700"  },
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
              <div className="bg-green-500 h-full rounded-full transition-all" style={{ width: `${rate}%` }} />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">{rate}% of {total} items validated</p>
          </div>

          <div className="border border-gray-100 rounded-lg p-3 bg-gray-50 space-y-1.5">
            <p className="text-[11px] text-gray-400 mb-0.5 font-medium">Document breakdown</p>
            {queue.map((q) => (
              <div key={q.code} className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-gray-500">{q.code}</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[q.status]}`}>{q.status}</span>
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
export default function PMTValidatorDashboard() {
  const [queue, setQueue]          = useState(initialQueue);
  const [selectedRef, setSelected] = useState(null);
  const [modal, setModal]          = useState(null);
  const [toast, setToast]          = useState({ visible: false, message: "", type: "green" });

  const showToast = (message, type = "green") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  const handleValidate = (code) => {
    setQueue((prev) => prev.map((q) => q.code === code ? { ...q, status: "Validated" } : q));
    setSelected(null);
    setModal(null);
    showToast(`✓ ${code} validated successfully`, "green");
  };

  const handleReturn = (code, reason) => {
    if (!reason) return;
    setQueue((prev) => prev.map((q) => q.code === code ? { ...q, status: "Returned" } : q));
    setSelected(null);
    setModal(null);
    showToast(`↩ ${code} returned: ${reason}`, "red");
  };

  const stats = [
    { label: "For Validation", value: queue.filter((q) => q.status === "For Review").length,  sub: "WFP/CAPA pending review", icon: ClipboardCheck, color: "blue"  },
    { label: "In Progress",    value: queue.filter((q) => q.status === "In Progress").length,  sub: "currently reviewing",     icon: Clock,          color: "amber" },
    { label: "Validated",      value: queue.filter((q) => q.status === "Validated").length,    sub: "approved this FY",        icon: CheckCircle,    color: "green" },
    { label: "Returned",       value: queue.filter((q) => q.status === "Returned").length,     sub: "sent back for revision",  icon: XCircle,        color: "red"   },
  ];

  const returnedItems = queue.filter((q) => q.status === "Returned");
  const forReviewCount = queue.filter((q) => q.status === "For Review" || q.status === "In Progress").length;
  const oldest = [...queue]
    .filter((q) => q.status === "For Review" || q.status === "In Progress")
    .sort((a, b) => new Date("2026 " + a.submitted) - new Date("2026 " + b.submitted))[0];

  const quickActions = [
    { label: "Board View", icon: LayoutGrid, key: "kanban",   hoverCls: "hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700" },
    { label: "Validate",   icon: ThumbsUp,   key: "validate", hoverCls: "hover:bg-green-50 hover:border-green-200 hover:text-green-700"    },
    { label: "Return",     icon: ThumbsDown, key: "return",   hoverCls: "hover:bg-red-50 hover:border-red-200 hover:text-red-700"          },
    { label: "Reports",    icon: BarChart2,  key: "reports",  hoverCls: "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"       },
  ];

  return (
    <main className="p-4 sm:p-6 space-y-6">
      <div>
        <h2 className="text-[15px] font-semibold text-gray-900">PMT Validation Queue</h2>
        <p className="text-[12px] text-gray-400 mt-0.5">Review and verify WFP / CAPA alignment · FY 2026</p>
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
            <button onClick={() => setModal("kanban")} className="text-[11px] text-blue-600 hover:underline">View all</button>
          </div>
          <div className="divide-y divide-gray-50">
            {queue.map((q) => (
              <div
                key={q.code}
                onClick={() => setSelected(selectedRef === q.code ? null : q.code)}
                className={`px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                  selectedRef === q.code ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-400 font-mono">{q.code}</p>
                  <p className="text-[12px] font-medium text-gray-800 truncate">{q.title}</p>
                  <p className="text-[11px] text-gray-400">by {q.owner}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[q.status]}`}>{q.status}</span>
                  <span className="text-[10px] text-gray-300">{q.submitted}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Inline action bar */}
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
                <button onClick={() => setModal("return")}
                  className="px-2.5 py-1 text-[11px] rounded-md bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 flex items-center gap-1">
                  <ThumbsDown className="w-3 h-3" /> Return
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions + Summary */}
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
            <div className={`border rounded-md p-3 ${forReviewCount > 0 ? "bg-blue-50 border-blue-100" : "bg-green-50 border-green-100"}`}>
              <p className={`text-[11px] font-semibold ${forReviewCount > 0 ? "text-blue-700" : "text-green-700"}`}>
                {forReviewCount > 0 ? `${forReviewCount} item${forReviewCount > 1 ? "s" : ""} in queue` : "Queue is clear"}
              </p>
              <p className={`text-[11px] mt-0.5 ${forReviewCount > 0 ? "text-blue-600" : "text-green-600"}`}>
                {oldest
                  ? `Oldest submission: ${oldest.submitted}. Please review within 2 working days.`
                  : "All items have been actioned."}
              </p>
            </div>
            {returnedItems.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-md p-3">
                <p className="text-[11px] font-semibold text-red-700">{returnedItems.length} returned item{returnedItems.length > 1 ? "s" : ""}</p>
                <p className="text-[11px] text-red-600 mt-0.5">
                  {returnedItems.map((d) => d.code).join(", ")} sent back for revision.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === "kanban"   && <KanbanModal   queue={queue} onClose={() => setModal(null)} onOpenModal={setModal} onSelectRef={setSelected} />}
      {modal === "validate" && <ValidateModal queue={queue} selectedRef={selectedRef} onSelect={setSelected} onValidate={handleValidate} onClose={() => setModal(null)} />}
      {modal === "return"   && <ReturnModal   queue={queue} selectedRef={selectedRef} onSelect={setSelected} onReturn={handleReturn}     onClose={() => setModal(null)} />}
      {modal === "reports"  && <ReportsModal  queue={queue} onClose={() => setModal(null)} />}

      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </main>
  );
}