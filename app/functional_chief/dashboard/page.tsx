"use client";

import { useState } from "react";
import {
  Briefcase, Clock, CheckCircle, XCircle,
  ThumbsUp, ThumbsDown, BarChart2, Eye,
  X, Check, RotateCcw, Download, ChevronRight,
} from "lucide-react";

const initialQueue = [
  { ref: "PPA-2026-003", title: "ALS Mobile Teacher Deployment",    type: "PPA", submittedBy: "M. Torres",   status: "For Approval", date: "May 19" },
  { ref: "ORS-2026-041", title: "Obligation for SHS Supplies",       type: "ORS", submittedBy: "E. Bancud",   status: "For Approval", date: "May 18" },
  { ref: "DV-2026-029",  title: "Payment — School Feeding Caterer",  type: "DV",  submittedBy: "J. Dela Cruz", status: "In Review",    date: "May 17" },
  { ref: "PPA-2026-006", title: "Gulayan sa Paaralan Program",        type: "PPA", submittedBy: "C. Basa",     status: "Approved",     date: "May 14" },
  { ref: "ORS-2026-039", title: "Obligation for Brigada Eskwela",     type: "ORS", submittedBy: "A. Reyes",    status: "Returned",     date: "May 12" },
  { ref: "DV-2026-030",  title: "Payment — IT Equipment Vendor",      type: "DV",  submittedBy: "R. Santos",   status: "For Approval", date: "May 11" },
  { ref: "PPA-2026-007", title: "Reading Program Materials",          type: "PPA", submittedBy: "L. Cruz",     status: "For Approval", date: "May 10" },
  { ref: "ORS-2026-040", title: "Obligation for MOOE Utilities",      type: "ORS", submittedBy: "D. Viray",    status: "In Review",    date: "May 9"  },
  { ref: "DV-2026-028",  title: "Payment — Janitorial Services",      type: "DV",  submittedBy: "P. Aquino",   status: "Approved",     date: "May 8"  },
];

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

function Toast({ message, type, visible }) {
  if (!visible) return null;
  const colors = {
    green: "bg-green-50 text-green-700 border-green-200",
    red:   "bg-red-50 text-red-700 border-red-200",
    blue:  "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg border text-[12px] font-medium shadow-sm transition-opacity ${colors[type]}`}>
      {message}
    </div>
  );
}

function ModalBackdrop({ onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function ApproveModal({ queue, selectedRef, onApprove, onClose }) {
  const item = selectedRef ? queue.find((q) => q.ref === selectedRef) : null;
  const actionable = queue.filter(
    (q) => q.status === "For Approval" || q.status === "In Review"
  );

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[400px] max-w-[95vw] overflow-hidden shadow-lg">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-green-600" /> Approve Item
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">
          {item ? (
            <div className="space-y-3">
              <div><p className="text-[11px] text-gray-400 mb-1">Reference</p><p className="text-[12px] font-mono text-gray-700">{item.ref}</p></div>
              <div><p className="text-[11px] text-gray-400 mb-1">Title</p><p className="text-[13px] font-medium text-gray-800">{item.title}</p></div>
              <div><p className="text-[11px] text-gray-400 mb-1">Submitted by</p><p className="text-[12px] text-gray-700">{item.submittedBy}</p></div>
              <div><p className="text-[11px] text-gray-400 mb-1">Current status</p>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[item.status]}`}>{item.status}</span>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[12px] text-gray-400 mb-3">No item selected. Choose one from the list below:</p>
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {actionable.map((q) => (
                  <button
                    key={q.ref}
                    onClick={() => onApprove(q.ref)}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
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
            <button
              onClick={() => onApprove(item.ref)}
              className="px-3 py-1.5 text-[12px] rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> Confirm Approval
            </button>
          )}
        </div>
      </div>
    </ModalBackdrop>
  );
}

function ReturnModal({ queue, selectedRef, onReturn, onClose }) {
  const [reason, setReason] = useState("");
  const item = selectedRef ? queue.find((q) => q.ref === selectedRef) : null;

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[400px] max-w-[95vw] overflow-hidden shadow-lg">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <ThumbsDown className="w-4 h-4 text-red-500" /> Return for Revision
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4">
          {item ? (
            <div className="space-y-3">
              <div><p className="text-[11px] text-gray-400 mb-1">Reference</p><p className="text-[12px] font-mono text-gray-700">{item.ref}</p></div>
              <div><p className="text-[11px] text-gray-400 mb-1">Title</p><p className="text-[13px] font-medium text-gray-800">{item.title}</p></div>
              <div>
                <p className="text-[11px] text-gray-400 mb-1">Reason for return</p>
                <textarea
                  className="w-full border border-gray-200 rounded-lg p-2 text-[12px] text-gray-800 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
                  rows={3}
                  placeholder="e.g. Incomplete supporting documents, budget line mismatch..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <p className="text-[12px] text-gray-400">Please select an item from the queue first.</p>
          )}
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
          {item && (
            <button
              onClick={() => onReturn(item.ref, reason)}
              className="px-3 py-1.5 text-[12px] rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Return Item
            </button>
          )}
        </div>
      </div>
    </ModalBackdrop>
  );
}

function ViewAllModal({ queue, onClose }) {
  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[600px] max-w-[95vw] overflow-hidden shadow-lg">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-500" /> All Queue Items
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-2 text-left text-[11px] text-gray-400 font-medium">Ref</th>
                <th className="px-4 py-2 text-left text-[11px] text-gray-400 font-medium">Title</th>
                <th className="px-4 py-2 text-left text-[11px] text-gray-400 font-medium">By</th>
                <th className="px-4 py-2 text-left text-[11px] text-gray-400 font-medium">Status</th>
                <th className="px-4 py-2 text-left text-[11px] text-gray-400 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {queue.map((q) => (
                <tr key={q.ref} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-mono text-[11px] text-gray-500">{q.ref}</td>
                  <td className="px-4 py-2 text-gray-800">{q.title}</td>
                  <td className="px-4 py-2 text-gray-500">{q.submittedBy}</td>
                  <td className="px-4 py-2">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[q.status]}`}>{q.status}</span>
                  </td>
                  <td className="px-4 py-2 text-gray-400">{q.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Close</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

function ReportsModal({ queue, onClose }) {
  const total    = queue.length;
  const approved = queue.filter((q) => q.status === "Approved").length;
  const returned = queue.filter((q) => q.status === "Returned").length;
  const pending  = queue.filter((q) => q.status === "For Approval").length;
  const review   = queue.filter((q) => q.status === "In Review").length;
  const rate     = total > 0 ? Math.round((approved / total) * 100) : 0;

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[440px] max-w-[95vw] overflow-hidden shadow-lg">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-gray-500" /> FY 2026 Summary Report
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Approved",     value: approved, cls: "bg-green-50 border-green-100 text-green-700" },
              { label: "Returned",     value: returned, cls: "bg-red-50 border-red-100 text-red-700" },
              { label: "For Approval", value: pending,  cls: "bg-blue-50 border-blue-100 text-blue-700" },
              { label: "In Review",    value: review,   cls: "bg-amber-50 border-amber-100 text-amber-700" },
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
              <div className="bg-green-500 h-full rounded-full transition-all" style={{ width: `${rate}%` }} />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">{rate}% of {total} total items approved</p>
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
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-[12px] rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

export default function FunctionalChiefDashboard() {
  const [queue, setQueue]           = useState(initialQueue);
  const [selectedRef, setSelectedRef] = useState(null);
  const [modal, setModal]           = useState(null); // "approve" | "return" | "viewAll" | "reports"
  const [toast, setToast]           = useState({ visible: false, message: "", type: "green" });

  const showToast = (message, type = "green") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  const handleApprove = (ref) => {
    setQueue((prev) => prev.map((q) => q.ref === ref ? { ...q, status: "Approved" } : q));
    setSelectedRef(null);
    setModal(null);
    showToast(`✓ ${ref} approved successfully`, "green");
  };

  const handleReturn = (ref) => {
    setQueue((prev) => prev.map((q) => q.ref === ref ? { ...q, status: "Returned" } : q));
    setSelectedRef(null);
    setModal(null);
    showToast(`↩ ${ref} returned for revision`, "red");
  };

  const stats = [
    { label: "For Approval", value: queue.filter((q) => q.status === "For Approval").length, sub: "awaiting office approval", icon: Briefcase,   color: "blue"  },
    { label: "In Review",    value: queue.filter((q) => q.status === "In Review").length,    sub: "currently reviewing",    icon: Clock,       color: "amber" },
    { label: "Approved",     value: queue.filter((q) => q.status === "Approved").length,     sub: "approved this FY",       icon: CheckCircle, color: "green" },
    { label: "Returned",     value: queue.filter((q) => q.status === "Returned").length,     sub: "sent back for revision", icon: XCircle,     color: "red"   },
  ];

  const pendingCount = queue.filter((q) => q.status === "For Approval").length;
  const displayQueue = queue.slice(0, 5);

  const quickActions = [
    { label: "Approve",  icon: ThumbsUp,  key: "approve",  hoverCls: "hover:bg-green-50 hover:border-green-200 hover:text-green-700" },
    { label: "Return",   icon: ThumbsDown,key: "return",   hoverCls: "hover:bg-red-50 hover:border-red-200 hover:text-red-700"   },
    { label: "View All", icon: Eye,       key: "viewAll",  hoverCls: "hover:bg-gray-50 hover:border-gray-200"                     },
    { label: "Reports",  icon: BarChart2, key: "reports",  hoverCls: "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700" },
  ];

  return (
    <main className="p-4 sm:p-6 space-y-6">
      <div>
        <h2 className="text-[15px] font-semibold text-gray-900">Functional Chief Approval Queue</h2>
        <p className="text-[12px] text-gray-400 mt-0.5">Office-level approval for PPAs, ORS, and DVs · FY 2026</p>
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
            <span className="text-[13px] font-semibold text-gray-800">Approval Queue</span>
            <button
              onClick={() => setModal("viewAll")}
              className="text-[11px] text-blue-600 hover:underline"
            >
              View all
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {displayQueue.map((q) => (
              <div
                key={q.ref}
                onClick={() => setSelectedRef(selectedRef === q.ref ? null : q.ref)}
                className={`px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                  selectedRef === q.ref ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <div className="min-w-0 flex items-start gap-2">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 ${typeColor[q.type]}`}>
                    {q.type}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-400 font-mono">{q.ref}</p>
                    <p className="text-[12px] font-medium text-gray-800 truncate">{q.title}</p>
                    <p className="text-[11px] text-gray-400">by {q.submittedBy}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[q.status]}`}>
                    {q.status}
                  </span>
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
                <button
                  onClick={() => setModal("approve")}
                  className="px-2.5 py-1 text-[11px] rounded-md bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Approve
                </button>
                <button
                  onClick={() => setModal("return")}
                  className="px-2.5 py-1 text-[11px] rounded-md bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Return
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
              <button
                key={a.label}
                onClick={() => setModal(a.key)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-md border border-gray-100 transition-colors text-center text-gray-500 ${a.hoverCls}`}
              >
                <a.icon className="w-4 h-4" />
                <span className="text-[11px] leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
          <div className="px-4 pb-4">
            {pendingCount === 0 ? (
              <div className="bg-green-50 border border-green-100 rounded-md p-3">
                <p className="text-[11px] font-semibold text-green-700">All caught up!</p>
                <p className="text-[11px] text-green-600 mt-0.5">No pending items at this time.</p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-100 rounded-md p-3">
                <p className="text-[11px] font-semibold text-amber-700">{pendingCount} item{pendingCount > 1 ? "s" : ""} pending</p>
                <p className="text-[11px] text-amber-600 mt-0.5">Oldest item: May 12. Please action within 2 working days.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === "approve" && (
        <ApproveModal
          queue={queue}
          selectedRef={selectedRef}
          onApprove={handleApprove}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "return" && (
        <ReturnModal
          queue={queue}
          selectedRef={selectedRef}
          onReturn={handleReturn}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "viewAll" && (
        <ViewAllModal queue={queue} onClose={() => setModal(null)} />
      )}
      {modal === "reports" && (
        <ReportsModal queue={queue} onClose={() => setModal(null)} />
      )}

      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </main>
  );
}