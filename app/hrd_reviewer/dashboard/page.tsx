"use client";

import { useState, ReactNode } from "react";
import {
  BookOpen, Clock, CheckCircle, XCircle, FilePlus, ThumbsUp,
  Search, BarChart2, X, Check, ChevronRight, AlertTriangle,
  Download, LayoutGrid, User, Calendar,
} from "lucide-react";

interface Document {
  ref: string;
  title: string;
  submittedBy: string;
  status: "For Review" | "In Progress" | "QA Cleared" | "Returned";
  date: string;
  type: string;
  returnReason: string;
  returnNote: string;
}

type ToastType = "green" | "red" | "blue" | "amber";

const colorMap = {
  blue:  "bg-blue-50 text-blue-700 border-blue-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  green: "bg-green-50 text-green-700 border-green-100",
  red:   "bg-red-50 text-red-700 border-red-100",
};

const statusColor = {
  "For Review":  "bg-blue-50 text-blue-700",
  "In Progress": "bg-amber-50 text-amber-700",
  "QA Cleared":  "bg-green-50 text-green-700",
  "Returned":    "bg-red-50 text-red-700",
};

const RETURN_REASONS = [
  "Incomplete training objectives",
  "Missing supporting references",
  "Targets not SMART",
  "Budget breakdown inconsistent",
  "Format/template not followed",
  "Other",
];

const DOC_TYPES = [
  "In-Service Training Plan",
  "LAC Session Documentation",
  "Scholarship Program Guidelines",
  "Teacher Competency Framework",
  "Coaching & Mentoring Handbook",
  "Learning Action Cell (LAC) Plan",
  "Staff Development Program",
  "Other L&D Document",
];

const initialDocs: Document[] = [
  { ref: "HRD-2026-011", title: "In-Service Training Plan Q2",    submittedBy: "P. Garcia", status: "For Review",  date: "May 19", type: "In-Service Training Plan",    returnReason: "", returnNote: "" },
  { ref: "HRD-2026-012", title: "LAC Session Documentation",      submittedBy: "R. Santos", status: "In Progress", date: "May 18", type: "LAC Session Documentation",    returnReason: "", returnNote: "" },
  { ref: "HRD-2026-013", title: "Scholarship Program Guidelines", submittedBy: "T. Ramos",  status: "QA Cleared",  date: "May 12", type: "Scholarship Program Guidelines", returnReason: "", returnNote: "" },
  { ref: "HRD-2026-014", title: "Teacher Competency Framework",   submittedBy: "V. Lim",    status: "Returned",    date: "May 10", type: "Teacher Competency Framework",  returnReason: "Targets not SMART", returnNote: "Please revise learning outcomes to follow SMART criteria." },
  { ref: "HRD-2026-015", title: "Coaching & Mentoring Handbook",  submittedBy: "C. Aquino", status: "For Review",  date: "May 20", type: "Coaching & Mentoring Handbook", returnReason: "", returnNote: "" },
];

/* ── helpers ── */
function agingBadge(dateStr: string): { label: string; cls: string } {
  const months: { [key: string]: number } = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
  const [mon, day] = dateStr.split(" ");
  const days = Math.floor((new Date(2026,4,24).getTime() - new Date(2026, months[mon], parseInt(day)).getTime()) / 86400000);
  if (days <= 3) return { label: `${days}d`, cls: "bg-green-50 text-green-600 border border-green-100" };
  if (days <= 6) return { label: `${days}d`, cls: "bg-amber-50 text-amber-600 border border-amber-100" };
  return { label: `${days}d`, cls: "bg-red-50 text-red-600 border border-red-100" };
}

function nextRef(docs: Document[]): string {
  const nums = docs.map((d: Document) => parseInt(d.ref.split("-")[2]));
  return `HRD-2026-${String(Math.max(...nums) + 1).padStart(3, "0")}`;
}

function Toast({ message, type, visible }: { message: string; type: ToastType; visible: boolean }): JSX.Element | null {
  if (!visible) return null;
  const c: { [key in ToastType]: string } = { green:"bg-green-50 text-green-700 border-green-200", red:"bg-red-50 text-red-700 border-red-200", blue:"bg-blue-50 text-blue-700 border-blue-200", amber:"bg-amber-50 text-amber-700 border-amber-200" };
  return (
    <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg border text-[12px] font-medium shadow-sm ${c[type]}`}>
      {message}
    </div>
  );
}

function ModalBackdrop({ onClose, children }: { onClose: () => void; children: ReactNode }): JSX.Element {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 overflow-y-auto py-8" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

/* ── New Review Modal ── */
function NewReviewModal({ docs, onCreate, onClose }: { docs: Document[]; onCreate: (data: { title: string; type: string; submittedBy: string; notes: string }) => void; onClose: () => void }): JSX.Element {
  const [title, setTitle]       = useState("");
  const [type, setType]         = useState("");
  const [submittedBy, setBy]    = useState("");
  const [notes, setNotes]       = useState("");
  const canSubmit = title && type && submittedBy;

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[460px] max-w-[95vw] shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <FilePlus className="w-4 h-4 text-blue-600" /> New Review Request
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <p className="text-[11px] text-gray-400 mb-1">Reference No.</p>
            <p className="text-[12px] font-mono text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">{nextRef(docs)}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-1">Document Type <span className="text-red-400">*</span></p>
            <select className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-[12px] text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-gray-300"
              value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Select type…</option>
              {DOC_TYPES.map((t: string) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-1">Document Title <span className="text-red-400">*</span></p>
            <input className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-[12px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300"
              placeholder="e.g. In-Service Training Plan Q3 2026"
              value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-1">Submitted By <span className="text-red-400">*</span></p>
            <input className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-[12px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300"
              placeholder="Last name, First initial (e.g. P. Garcia)"
              value={submittedBy} onChange={(e) => setBy(e.target.value)} />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-1">Initial notes (optional)</p>
            <textarea className="w-full border border-gray-200 rounded-lg p-2 text-[12px] text-gray-800 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
              rows={3} placeholder="Any initial observations or context for this review…"
              value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="text-[11px] text-blue-700 font-medium">Status will be set to "For Review"</p>
            <p className="text-[11px] text-blue-600 mt-0.5">Target turnaround: 3 working days per document.</p>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={() => canSubmit && onCreate({ title, type, submittedBy, notes })} disabled={!canSubmit}
            className={`px-3 py-1.5 text-[12px] rounded-lg flex items-center gap-1.5 border ${canSubmit ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"}`}>
            <FilePlus className="w-3.5 h-3.5" /> Create Review
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

/* ── Approve Doc Modal ── */
function ApproveModal({ docs, selectedRef, onSelect, onApprove, onReturn, onClose }: { docs: Document[]; selectedRef: string | null; onSelect: (ref: string) => void; onApprove: (ref: string) => void; onReturn: (ref: string, reason: string, note: string) => void; onClose: () => void }): JSX.Element {
  const [view, setView]     = useState<"approve" | "return">("approve");
  const [reason, setReason] = useState("");
  const [note, setNote]     = useState("");
  const item = selectedRef ? docs.find((d: Document) => d.ref === selectedRef) : null;
  const actionable = docs.filter((d: Document) => d.status === "For Review" || d.status === "In Progress");

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[440px] max-w-[95vw] shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-green-600" /> QA Decision
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
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

              {/* Toggle */}
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                <button onClick={() => setView("approve")}
                  className={`flex-1 py-1.5 text-[11px] font-medium transition-colors ${view === "approve" ? "bg-green-50 text-green-700 border-r border-gray-200" : "text-gray-400 hover:bg-gray-50 border-r border-gray-200"}`}>
                  QA Clear
                </button>
                <button onClick={() => setView("return")}
                  className={`flex-1 py-1.5 text-[11px] font-medium transition-colors ${view === "return" ? "bg-red-50 text-red-700" : "text-gray-400 hover:bg-gray-50"}`}>
                  Return
                </button>
              </div>

              {view === "approve" ? (
                <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                  <p className="text-[11px] text-green-700 font-medium">Confirm QA clearance</p>
                  <p className="text-[11px] text-green-600 mt-1">This certifies the document meets HRD quality standards and is cleared for implementation.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <p className="text-[11px] text-gray-400 mb-1">Return reason</p>
                    <select className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-[12px] text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-gray-300"
                      value={reason} onChange={(e) => setReason(e.target.value)}>
                      <option value="">Select a reason…</option>
                      {RETURN_REASONS.map((r: string) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 mb-1">Remarks</p>
                    <textarea className="w-full border border-gray-200 rounded-lg p-2 text-[12px] text-gray-800 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
                      rows={2} placeholder="Specific instructions for revision…"
                      value={note} onChange={(e) => setNote(e.target.value)} />
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5">
                    <p className="text-[11px] text-amber-700 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Submitter will be notified to revise.</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-[12px] text-gray-400 mb-3">Select a document to act on:</p>
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {actionable.length > 0 ? actionable.map((d: Document) => (
                  <button key={d.ref} onClick={() => onSelect(d.ref)}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-mono text-gray-400">{d.ref}</p>
                      <p className="text-[12px] font-medium text-gray-800 truncate">{d.title}</p>
                      <p className="text-[11px] text-gray-400">by {d.submittedBy}</p>
                    </div>
                    <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
                  </button>
                )) : <p className="text-[12px] text-gray-400 text-center py-4">No actionable documents.</p>}
              </div>
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
          {item && view === "approve" && (
            <button onClick={() => onApprove(item.ref)}
              className="px-3 py-1.5 text-[12px] rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Confirm QA Clear
            </button>
          )}
          {item && view === "return" && (
            <button onClick={() => reason && onReturn(item.ref, reason, note)} disabled={!reason}
              className={`px-3 py-1.5 text-[12px] rounded-lg flex items-center gap-1.5 border ${reason ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100" : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"}`}>
              <XCircle className="w-3.5 h-3.5" /> Confirm Return
            </button>
          )}
        </div>
      </div>
    </ModalBackdrop>
  );
}

/* ── Search Modal ── */
function SearchModal({ docs, onClose }: { docs: Document[]; onClose: () => void }): JSX.Element {
  const [query, setQuery]   = useState("");
  const [filter, setFilter] = useState("all");
  const results = docs.filter((d: Document) => {
    const q = query.trim().toLowerCase();
    const matchQ = q.length < 2 || d.ref.toLowerCase().includes(q) || d.title.toLowerCase().includes(q) || d.submittedBy.toLowerCase().includes(q) || d.type.toLowerCase().includes(q);
    const matchF = filter === "all" || d.status === filter;
    return matchQ && matchF;
  });

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[520px] max-w-[95vw] shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" /> Search HRD Documents
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4">
          <div className="flex gap-2 mb-3">
            <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-gray-300">
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input autoFocus className="flex-1 text-[12px] text-gray-800 outline-none bg-transparent placeholder-gray-300"
                placeholder="Ref, title, type, or submitter…"
                value={query} onChange={(e) => setQuery(e.target.value)} />
              {query && <button onClick={() => setQuery("")} className="text-gray-300 hover:text-gray-500"><X className="w-3 h-3" /></button>}
            </div>
            <select className="border border-gray-200 rounded-lg px-2 py-1.5 text-[12px] text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-gray-300"
              value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="For Review">For Review</option>
              <option value="In Progress">In Progress</option>
              <option value="QA Cleared">QA Cleared</option>
              <option value="Returned">Returned</option>
            </select>
          </div>
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {results.length > 0 ? results.map((d: Document) => {
              const age = agingBadge(d.date);
              return (
                <div key={d.ref} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-100 hover:bg-gray-50">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-mono text-gray-400">{d.ref}</p>
                    <p className="text-[12px] font-medium text-gray-800 truncate">{d.title}</p>
                    <p className="text-[11px] text-gray-400">{d.type} · by {d.submittedBy}</p>
                    {d.returnReason && <p className="text-[11px] text-red-500 mt-0.5">Returned: {d.returnReason}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[d.status]}`}>{d.status}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${age.cls}`}>{age.label}</span>
                  </div>
                </div>
              );
            }) : <p className="text-[12px] text-gray-400 text-center py-6">No documents match your search.</p>}
          </div>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
          <p className="text-[11px] text-gray-400">{results.length} of {docs.length} documents</p>
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Close</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

/* ── L&D Reports Modal ── */
function ReportsModal({ docs, onClose }: { docs: Document[]; onClose: () => void }): JSX.Element {
  const total     = docs.length;
  const cleared   = docs.filter((d: Document) => d.status === "QA Cleared").length;
  const returned  = docs.filter((d: Document) => d.status === "Returned").length;
  const forReview = docs.filter((d: Document) => d.status === "For Review").length;
  const inProg    = docs.filter((d: Document) => d.status === "In Progress").length;
  const rate      = total > 0 ? Math.round((cleared / total) * 100) : 0;

  const byType = DOC_TYPES.map((t) => ({
    type: t,
    count: docs.filter((d: Document) => d.type === t).length,
    cleared: docs.filter((d: Document) => d.type === t && d.status === "QA Cleared").length,
  })).filter((r) => r.count > 0);

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[460px] max-w-[95vw] shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-gray-500" /> L&D QA Report · FY 2026
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "QA Cleared",  value: cleared,   cls: "bg-green-50 border-green-100 text-green-700" },
              { label: "Returned",    value: returned,  cls: "bg-red-50 border-red-100 text-red-700"       },
              { label: "For Review",  value: forReview, cls: "bg-blue-50 border-blue-100 text-blue-700"    },
              { label: "In Progress", value: inProg,    cls: "bg-amber-50 border-amber-100 text-amber-700" },
            ].map((s: { label: string; value: number; cls: string }) => (
              <div key={s.label} className={`border rounded-lg p-3 ${s.cls}`}>
                <p className="text-[11px] font-medium">{s.label}</p>
                <p className="text-[24px] font-semibold mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[11px] text-gray-400 mb-1.5">QA clearance rate</p>
            <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-green-500 h-full rounded-full transition-all" style={{ width: `${rate}%` }} />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">{rate}% of {total} documents cleared</p>
          </div>

          {byType.length > 0 && (
            <div className="border border-gray-100 rounded-lg p-3 bg-gray-50 space-y-2">
              <p className="text-[11px] text-gray-500 font-medium mb-1">By document type</p>
              {byType.map((r: { type: string; count: number; cleared: number }) => (
                <div key={r.type} className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-600 truncate pr-2">{r.type}</span>
                    <span className="text-gray-400 flex-shrink-0">{r.cleared}/{r.count} cleared</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-1 overflow-hidden">
                    <div className="bg-green-400 h-full rounded-full" style={{ width: r.count > 0 ? `${Math.round((r.cleared/r.count)*100)}%` : "0%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border border-gray-100 rounded-lg p-3 bg-gray-50 space-y-1.5">
            <p className="text-[11px] text-gray-500 font-medium">Document breakdown</p>
            {docs.map((d: Document) => (
              <div key={d.ref} className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-gray-500">{d.ref}</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[d.status]}`}>{d.status}</span>
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

/* ── View All Board Modal ── */
function BoardModal({ docs, onClose, onOpenModal, onSelectRef }: { docs: Document[]; onClose: () => void; onOpenModal: (modal: "new" | "approve" | "search" | "reports" | "board") => void; onSelectRef: (ref: string) => void }): JSX.Element {
  const COLS = ["For Review", "In Progress", "QA Cleared", "Returned"] as const;
  type ColumnStatus = typeof COLS[number];
  
  const colCfg: { [key in ColumnStatus]: { icon: any; accent: string; bg: string; border: string; text: string; count: string } } = {
    "For Review":  { icon: BookOpen,    accent: "#3b82f6", bg: "bg-blue-50",  border: "border-blue-200",  text: "text-blue-700",  count: "bg-blue-100 text-blue-700"   },
    "In Progress": { icon: Clock,       accent: "#f59e0b", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", count: "bg-amber-100 text-amber-700" },
    "QA Cleared":  { icon: CheckCircle, accent: "#22c55e", bg: "bg-green-50", border: "border-green-200", text: "text-green-700", count: "bg-green-100 text-green-700" },
    "Returned":    { icon: XCircle,     accent: "#ef4444", bg: "bg-red-50",   border: "border-red-200",   text: "text-red-700",   count: "bg-red-100 text-red-700"     },
  };

  function handleAction(ref: string): void {
    onSelectRef(ref);
    onClose();
    onOpenModal("approve");
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[780px] max-w-[95vw] shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-[14px] font-semibold text-gray-900">HRD Document Board · FY 2026</h2>
            <p className="text-[11px] text-gray-400">{docs.length} total documents</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-4 bg-white">
          <span className="text-[11px] text-gray-400 font-medium">Age:</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100">≤3d on track</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">4–6d review soon</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">7d+ overdue</span>
        </div>
        <div className="p-4 overflow-x-auto">
          <div className="flex gap-3 min-w-[640px]">
            {COLS.map((status: ColumnStatus) => {
              const cfg = colCfg[status];
              const Icon = cfg.icon;
              const items = docs.filter((d: Document) => d.status === status);
              const canAct = status === "For Review" || status === "In Progress";
              return (
                <div key={status} className="flex-1 min-w-[150px]">
                  <div className={`flex items-center justify-between px-3 py-2 rounded-t-lg border ${cfg.border} ${cfg.bg}`}>
                    <div className={`flex items-center gap-1.5 ${cfg.text}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-semibold">{status}</span>
                    </div>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${cfg.count}`}>{items.length}</span>
                  </div>
                  <div className={`border-x border-b ${cfg.border} rounded-b-lg p-2 space-y-2 min-h-[160px] bg-gray-50/50`}>
                    {items.length > 0 ? items.map((d: Document) => {
                      const age = agingBadge(d.date);
                      return (
                        <div key={d.ref} className="bg-white border border-gray-200 rounded-lg p-2.5 space-y-1.5 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-[10px] font-mono text-gray-400">{d.ref}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border flex-shrink-0 ${age.cls}`}>{age.label}</span>
                          </div>
                          <p className="text-[11px] font-medium text-gray-800 leading-tight">{d.title}</p>
                          <p className="text-[11px] text-gray-400">by {d.submittedBy}</p>
                          {d.returnReason && <p className="text-[10px] text-red-500">{d.returnReason}</p>}
                          {canAct && (
                            <div className="pt-1 border-t border-gray-100">
                              <button onClick={() => handleAction(d.ref)}
                                className="w-full py-0.5 text-[10px] rounded bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 flex items-center justify-center gap-1">
                                <Check className="w-2.5 h-2.5" /> QA Decision
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    }) : (
                      <div className="flex flex-col items-center justify-center h-[100px] opacity-40">
                        <Icon className={`w-5 h-5 mb-1 ${cfg.text}`} />
                        <p className="text-[11px] text-gray-400">Empty</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-white">Close</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

/* ── Main Dashboard ── */
export default function HRDReviewerDashboard() {
  const [docs, setDocs]            = useState<Document[]>(initialDocs);
  const [selectedRef, setSelected] = useState<string | null>(null);
  const [modal, setModal]          = useState<"new" | "approve" | "search" | "reports" | "board" | null>(null);
  const [toast, setToast]          = useState<{ visible: boolean; message: string; type: ToastType }>({ visible: false, message: "", type: "green" });

  const showToast = (message: string, type: ToastType = "green"): void => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  const handleCreate = (data: { title: string; type: string; submittedBy: string; notes: string }): void => {
    const ref = nextRef(docs);
    setDocs((prev) => [...prev, {
      ref, title: data.title, type: data.type, submittedBy: data.submittedBy,
      status: "For Review", date: "May 24", returnReason: "", returnNote: "",
    }]);
    setModal(null);
    showToast(`✓ ${ref} added to review queue`, "blue");
  };

  const handleApprove = (ref: string): void => {
    setDocs((prev) => prev.map((d) => d.ref === ref ? { ...d, status: "QA Cleared", returnReason: "", returnNote: "" } : d));
    setSelected(null); setModal(null);
    showToast(`✓ ${ref} QA cleared`, "green");
  };

  const handleReturn = (ref: string, reason: string, note: string): void => {
    setDocs((prev) => prev.map((d) => d.ref === ref ? { ...d, status: "Returned", returnReason: reason, returnNote: note } : d));
    setSelected(null); setModal(null);
    showToast(`↩ ${ref} returned: ${reason}`, "red");
  };

  const stats = [
    { label: "For QA Review", value: docs.filter((d) => d.status === "For Review").length,  sub: "training/L&D docs pending", icon: BookOpen,    color: "blue"  },
    { label: "In Progress",   value: docs.filter((d) => d.status === "In Progress").length,  sub: "currently reviewing",       icon: Clock,       color: "amber" },
    { label: "QA Cleared",    value: docs.filter((d) => d.status === "QA Cleared").length,   sub: "documents approved",        icon: CheckCircle, color: "green" },
    { label: "Returned",      value: docs.filter((d) => d.status === "Returned").length,     sub: "needs revision",            icon: XCircle,     color: "red"   },
  ];

  const returnedDocs   = docs.filter((d) => d.status === "Returned");
  const pendingCount   = docs.filter((d) => d.status === "For Review" || d.status === "In Progress").length;

  const quickActions = [
    { label: "New Review",  icon: FilePlus,  key: "new" as const,     hoverCls: "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"   },
    { label: "Approve Doc", icon: ThumbsUp,  key: "approve" as const, hoverCls: "hover:bg-green-50 hover:border-green-200 hover:text-green-700" },
    { label: "Search Docs", icon: Search,    key: "search" as const,  hoverCls: "hover:bg-gray-50 hover:border-gray-200"                        },
    { label: "L&D Reports", icon: BarChart2, key: "reports" as const, hoverCls: "hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700" },
  ];

  return (
    <main className="p-4 sm:p-6 space-y-6">
      <div>
        <h2 className="text-[15px] font-semibold text-gray-900">HRD Review Queue</h2>
        <p className="text-[12px] text-gray-400 mt-0.5">Quality assurance of training and L&D documents · FY 2026</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s: { label: string; value: number; sub: string; icon: any; color: string }) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-gray-500">{s.label}</span>
              <span className={`w-7 h-7 flex items-center justify-center rounded-md border ${colorMap[s.color as keyof typeof colorMap]}`}>
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
            <span className="text-[13px] font-semibold text-gray-800">Document Queue</span>
            <button onClick={() => setModal("board")} className="text-[11px] text-blue-600 hover:underline flex items-center gap-1">
              <LayoutGrid className="w-3 h-3" /> View all
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {docs.map((d: Document) => (
              <div key={d.ref}
                onClick={() => setSelected(selectedRef === d.ref ? null : d.ref)}
                className={`px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${selectedRef === d.ref ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-400 font-mono">{d.ref}</p>
                  <p className="text-[12px] font-medium text-gray-800 truncate">{d.title}</p>
                  <p className="text-[11px] text-gray-400">by {d.submittedBy}</p>
                  {d.returnReason && <p className="text-[11px] text-red-500 mt-0.5 truncate">Returned: {d.returnReason}</p>}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[d.status]}`}>{d.status}</span>
                  <span className="text-[10px] text-gray-300">{d.date}</span>
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
                {(docs.find((d) => d.ref === selectedRef)?.status === "For Review" ||
                  docs.find((d) => d.ref === selectedRef)?.status === "In Progress") && (
                  <button onClick={() => setModal("approve")}
                    className="px-2.5 py-1 text-[11px] rounded-md bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 flex items-center gap-1">
                    <Check className="w-3 h-3" /> QA Decision
                  </button>
                )}
                <button onClick={() => setSelected(null)}
                  className="px-2.5 py-1 text-[11px] rounded-md bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center gap-1">
                  <X className="w-3 h-3" /> Deselect
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="text-[13px] font-semibold text-gray-800">Quick Actions</span>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {quickActions.map((a: { label: string; icon: any; key: "new" | "approve" | "search" | "reports"; hoverCls: string }) => (
              <button key={a.label} onClick={() => setModal(a.key)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-md border border-gray-100 transition-colors text-center text-gray-500 ${a.hoverCls}`}>
                <a.icon className="w-4 h-4" />
                <span className="text-[11px] leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
          <div className="px-4 pb-4 space-y-2">
            <div className={`border rounded-md p-3 ${pendingCount > 0 ? "bg-blue-50 border-blue-100" : "bg-green-50 border-green-100"}`}>
              <p className={`text-[11px] font-semibold ${pendingCount > 0 ? "text-blue-700" : "text-green-700"}`}>
                {pendingCount > 0 ? `${pendingCount} doc${pendingCount > 1 ? "s" : ""} for review` : "Queue is clear"}
              </p>
              <p className={`text-[11px] mt-0.5 ${pendingCount > 0 ? "text-blue-600" : "text-green-600"}`}>
                Target turnaround: 3 working days per document.
              </p>
            </div>
            {returnedDocs.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-md p-3">
                <p className="text-[11px] font-semibold text-red-700">{returnedDocs.length} returned doc{returnedDocs.length > 1 ? "s" : ""}</p>
                {returnedDocs.map((d: Document) => (
                  <p key={d.ref} className="text-[11px] text-red-600 mt-0.5">
                    <span className="font-mono">{d.ref}</span> — {d.returnReason}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {modal === "new"     && <NewReviewModal docs={docs} onCreate={handleCreate} onClose={() => setModal(null)} />}
      {modal === "approve" && <ApproveModal   docs={docs} selectedRef={selectedRef} onSelect={setSelected} onApprove={handleApprove} onReturn={handleReturn} onClose={() => setModal(null)} />}
      {modal === "search"  && <SearchModal    docs={docs} onClose={() => setModal(null)} />}
      {modal === "reports" && <ReportsModal   docs={docs} onClose={() => setModal(null)} />}
      {modal === "board"   && <BoardModal     docs={docs} onClose={() => setModal(null)} onOpenModal={setModal} onSelectRef={setSelected} />}

      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </main>
  );
}