"use client";

import { useState, ReactNode } from "react";
import { ChangeEvent, DragEvent } from "react";
import {
  Database, Clock, CheckCircle, AlertCircle, RefreshCw,
  Upload, Search, X, Check, AlertTriangle, ChevronRight,
  FileText, User, Calendar, LayoutGrid, BarChart2, Download,
} from "lucide-react";

interface Entry {
  ref: string;
  program: string;
  coordinator: string;
  status: "Pending" | "In Progress" | "Validated" | "Discrepancy";
  date: string;
  budget: string;
  target: string;
  discrepancyNote: string;
}

interface AgingBadgeResult {
  label: string;
  cls: string;
}

const colorMap = {
  blue:  "bg-blue-50 text-blue-700 border-blue-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  green: "bg-green-50 text-green-700 border-green-100",
  red:   "bg-red-50 text-red-700 border-red-100",
};

const statusColor = {
  "Pending":     "bg-blue-50 text-blue-700",
  "In Progress": "bg-amber-50 text-amber-700",
  "Validated":   "bg-green-50 text-green-700",
  "Discrepancy": "bg-red-50 text-red-700",
};

const initialEntries: Entry[] = [
  { ref: "PMIS-0045", program: "School-Based Feeding",       coordinator: "J. Dela Cruz", status: "Validated",   date: "May 10", budget: "₱120,000", target: "250 pupils",   discrepancyNote: "" },
  { ref: "PMIS-0046", program: "Brigada Eskwela",            coordinator: "A. Reyes",     status: "Pending",     date: "May 18", budget: "₱45,000",  target: "12 schools",   discrepancyNote: "" },
  { ref: "PMIS-0047", program: "ALS Mobile Teacher",         coordinator: "M. Torres",    status: "In Progress", date: "May 19", budget: "₱88,000",  target: "3 mobile teachers", discrepancyNote: "" },
  { ref: "PMIS-0048", program: "Gulayan sa Paaralan",        coordinator: "C. Basa",      status: "Discrepancy", date: "May 17", budget: "₱32,000",  target: "18 schools",   discrepancyNote: "Budget figure in PMIS (₱28,000) differs from submitted document (₱32,000)." },
  { ref: "PMIS-0049", program: "Senior High Work Immersion", coordinator: "L. Cruz",      status: "Pending",     date: "May 20", budget: "₱67,500",  target: "40 students",  discrepancyNote: "" },
];

/* ── helpers ── */
function agingBadge(dateStr: string): AgingBadgeResult {
  const months: Record<string, number> = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
  const [mon, day] = dateStr.split(" ");
  const d = new Date(2026, months[mon as keyof typeof months], parseInt(day));
  const days = Math.floor((new Date(2026,4,24).getTime() - d.getTime()) / 86400000);
  if (days <= 2) return { label: `${days}d`, cls: "bg-green-50 text-green-600 border border-green-100" };
  if (days <= 5) return { label: `${days}d`, cls: "bg-amber-50 text-amber-600 border border-amber-100" };
  return { label: `${days}d`, cls: "bg-red-50 text-red-600 border border-red-100" };
}

interface ToastProps {
  message: string;
  type: "green" | "red" | "blue" | "amber";
  visible: boolean;
}

function Toast({ message, type, visible }: ToastProps) {
  if (!visible) return null;
  const c: Record<string, string> = { green:"bg-green-50 text-green-700 border-green-200", red:"bg-red-50 text-red-700 border-red-200", blue:"bg-blue-50 text-blue-700 border-blue-200", amber:"bg-amber-50 text-amber-700 border-amber-200" };
  return (
      <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg border text-[12px] font-medium shadow-sm ${c[type as keyof typeof c]}`}>
      {message}
    </div>
  );
}

interface ModalBackdropProps {
  onClose: () => void;
  children: ReactNode;
}

function ModalBackdrop({ onClose, children }: ModalBackdropProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 overflow-y-auto py-8" onClick={onClose}>
      <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

interface ValidateModalProps {
  entries: Entry[];
  selectedRef: string | null;
  onSelect: (ref: string) => void;
  onValidate: (ref: string) => void;
  onClose: () => void;
}

/* ── Validate Entry Modal ── */
function ValidateModal({ entries, selectedRef, onSelect, onValidate, onClose }: ValidateModalProps) {
  const item = selectedRef ? entries.find((e) => e.ref === selectedRef) : null;
  const actionable = entries.filter((e: Entry) => e.status === "Pending" || e.status === "In Progress");

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[440px] max-w-[95vw] shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" /> Validate PMIS Entry
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4">
          {item ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-[11px] text-gray-400 mb-1">Reference</p><p className="text-[12px] font-mono text-gray-700">{item.ref}</p></div>
                <div><p className="text-[11px] text-gray-400 mb-1">Date</p><p className="text-[12px] text-gray-700">{item.date}</p></div>
              </div>
              <div><p className="text-[11px] text-gray-400 mb-1">Program</p><p className="text-[13px] font-medium text-gray-800">{item.program}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-[11px] text-gray-400 mb-1">Budget</p><p className="text-[12px] text-gray-700">{item.budget}</p></div>
                <div><p className="text-[11px] text-gray-400 mb-1">Target</p><p className="text-[12px] text-gray-700">{item.target}</p></div>
              </div>
              <div><p className="text-[11px] text-gray-400 mb-1">Coordinator</p><p className="text-[12px] text-gray-700">{item.coordinator}</p></div>
              <div><p className="text-[11px] text-gray-400 mb-1">Current status</p>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[item.status as keyof typeof statusColor]}`}>{item.status}</span>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                <p className="text-[11px] text-green-700 font-medium">Confirm PMIS validation</p>
                <p className="text-[11px] text-green-600 mt-1">This certifies that the data entry has been cross-checked against source documents and is cleared for PMIS encoding.</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[12px] text-gray-400 mb-3">Select an entry to validate:</p>
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {actionable.length > 0 ? actionable.map((e: Entry) => (
                  <button key={e.ref} onClick={() => onSelect(e.ref)}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-mono text-gray-400">{e.ref}</p>
                      <p className="text-[12px] font-medium text-gray-800 truncate">{e.program}</p>
                      <p className="text-[11px] text-gray-400">{e.coordinator}</p>
                    </div>
                    <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
                  </button>
                )) : <p className="text-[12px] text-gray-400 text-center py-4">No pending entries.</p>}
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

interface UploadModalProps {
  onUpload: (data: { ref: string; program: string; budget: string; target: string; coordinator: string }) => void;
  onClose: () => void;
}

/* ── Upload Data Modal ── */
function UploadModal({ onUpload, onClose }: UploadModalProps) {
  const [file, setFile]       = useState<File | null>(null);
  const [program, setProgram] = useState("");
  const [ref, setRef]         = useState("");
  const [budget, setBudget]   = useState("");
  const [target, setTarget]   = useState("");
  const [coord, setCoord]     = useState("");
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const canSubmit = program && ref && budget && target && coord;

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[460px] max-w-[95vw] shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-600" /> Upload PMIS Data
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 space-y-3">
          {/* File drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("pmis-file-input")?.click()}
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${dragging ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}
          >
            <input id="pmis-file-input" type="file" accept=".xlsx,.csv,.pdf" className="hidden" onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] || null)} />
            <Upload className={`w-5 h-5 mx-auto mb-1.5 ${dragging ? "text-blue-500" : "text-gray-300"}`} />
            {file
              ? <p className="text-[12px] text-blue-700 font-medium">{(file as File).name}</p>
              : <>
                  <p className="text-[12px] text-gray-500">Drag & drop or click to attach</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">.xlsx, .csv, or .pdf</p>
                </>
            }
          </div>

          {/* Manual fields */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[11px] text-gray-400 mb-1">PMIS Ref No. <span className="text-red-400">*</span></p>
              <input className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-[12px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300"
                placeholder="PMIS-00XX" value={ref} onChange={(e) => setRef(e.target.value)} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 mb-1">Coordinator <span className="text-red-400">*</span></p>
              <input className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-[12px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300"
                placeholder="Last name, First initial" value={coord} onChange={(e) => setCoord(e.target.value)} />
            </div>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-1">Program Name <span className="text-red-400">*</span></p>
            <input className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-[12px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300"
              placeholder="e.g. Brigada Eskwela Implementation" value={program} onChange={(e) => setProgram(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[11px] text-gray-400 mb-1">Budget <span className="text-red-400">*</span></p>
              <input className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-[12px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300"
                placeholder="₱0,000" value={budget} onChange={(e) => setBudget(e.target.value)} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 mb-1">Target Output <span className="text-red-400">*</span></p>
              <input className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-[12px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300"
                placeholder="e.g. 250 pupils" value={target} onChange={(e) => setTarget(e.target.value)} />
            </div>
          </div>
          <p className="text-[11px] text-gray-400">Fields marked <span className="text-red-400">*</span> are required.</p>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={() => canSubmit && onUpload({ ref, program, budget, target, coordinator: coord })}
            disabled={!canSubmit}
            className={`px-3 py-1.5 text-[12px] rounded-lg flex items-center gap-1.5 border ${canSubmit ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"}`}>
            <Upload className="w-3.5 h-3.5" /> Submit Entry
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

interface SyncModalProps {
  entries: Entry[];
  onClose: () => void;
  showToast: (message: string, type?: "green" | "red" | "blue" | "amber") => void;
}

/* ── Sync PMIS Modal ── */
function SyncModal({ entries, onClose, showToast }: SyncModalProps) {
  const [syncing, setSyncing]   = useState(false);
  const [done, setDone]         = useState(false);
  const [progress, setProgress] = useState(0);
  const [log, setLog]           = useState<string[]>([]);

  const steps = [
    "Connecting to PMIS server…",
    "Fetching remote records…",
    "Cross-checking local entries…",
    "Flagging discrepancies…",
    "Sync complete.",
  ];

  function startSync() {
    setSyncing(true); setDone(false); setProgress(0); setLog([]);
    let i = 0;
    const interval = setInterval(() => {
      setLog((prev: string[]) => [...prev, steps[i]]);
      setProgress(Math.round(((i + 1) / steps.length) * 100));
      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        setSyncing(false); setDone(true);
      }
    }, 600);
  }

  const validated  = entries.filter((e: Entry) => e.status === "Validated").length;
  const discrepant = entries.filter((e: Entry) => e.status === "Discrepancy").length;
  const pending    = entries.filter((e: Entry) => e.status === "Pending" || e.status === "In Progress").length;

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[420px] max-w-[95vw] shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 text-blue-500 ${syncing ? "animate-spin" : ""}`} /> Sync PMIS
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 space-y-4">
          {/* Current state */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Validated",    value: validated,  cls: "bg-green-50 border-green-100 text-green-700" },
              { label: "Pending",      value: pending,    cls: "bg-blue-50 border-blue-100 text-blue-700"   },
              { label: "Discrepancy",  value: discrepant, cls: "bg-red-50 border-red-100 text-red-700"      },
            ].map((s) => (
              <div key={s.label} className={`border rounded-lg p-2.5 text-center ${s.cls}`}>
                <p className="text-[18px] font-semibold">{s.value}</p>
                <p className="text-[10px] font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          {(syncing || done) && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] text-gray-500 font-medium">Sync progress</p>
                <p className="text-[11px] text-gray-400">{progress}%</p>
              </div>
              <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${done ? "bg-green-500" : "bg-blue-500"}`} style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {/* Log */}
          {log.length > 0 && (
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 space-y-1 max-h-36 overflow-y-auto">
              {log.map((l, i) => (
                <p key={i} className={`text-[11px] font-mono flex items-center gap-1.5 ${i === log.length - 1 && done ? "text-green-600 font-semibold" : "text-gray-500"}`}>
                  {i === log.length - 1 && done ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-gray-300 inline-block" />}
                  {l}
                </p>
              ))}
            </div>
          )}

          {done && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-3">
              <p className="text-[11px] text-green-700 font-medium">PMIS sync completed</p>
              <p className="text-[11px] text-green-600 mt-0.5">{validated} entries confirmed · {discrepant} discrepanc{discrepant === 1 ? "y" : "ies"} flagged</p>
            </div>
          )}

          {!syncing && !done && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-[11px] text-blue-700 font-medium">Ready to sync</p>
              <p className="text-[11px] text-blue-600 mt-0.5">This will fetch the latest records from PMIS and flag any data mismatches.</p>
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Close</button>
          {!done && (
            <button onClick={startSync} disabled={syncing}
              className={`px-3 py-1.5 text-[12px] rounded-lg flex items-center gap-1.5 border ${syncing ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed" : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"}`}>
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing…" : "Start Sync"}
            </button>
          )}
          {done && (
            <button onClick={() => { showToast("PMIS sync report downloaded", "blue"); onClose(); }}
              className="px-3 py-1.5 text-[12px] rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Download Report
            </button>
          )}
        </div>
      </div>
    </ModalBackdrop>
  );
}

interface SearchModalProps {
  entries: Entry[];
  onClose: () => void;
}

/* ── Search Records Modal ── */
function SearchModal({ entries, onClose }: SearchModalProps) {
  const [query, setQuery]   = useState("");
  const [filter, setFilter] = useState("all");

  const results = entries.filter((e: Entry) => {
    const matchQ = query.trim().length < 2 || (
      e.ref.toLowerCase().includes(query.toLowerCase()) ||
      e.program.toLowerCase().includes(query.toLowerCase()) ||
      e.coordinator.toLowerCase().includes(query.toLowerCase())
    );
    const matchF = filter === "all" || e.status === filter;
    return matchQ && matchF;
  });

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[520px] max-w-[95vw] shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" /> Search PMIS Records
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4">
          <div className="flex gap-2 mb-3">
            <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-gray-300">
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input autoFocus
                className="flex-1 text-[12px] text-gray-800 outline-none bg-transparent placeholder-gray-300"
                placeholder="Search by ref, program, or coordinator…"
                value={query} onChange={(e) => setQuery(e.target.value)} />
              {query && <button onClick={() => setQuery("")} className="text-gray-300 hover:text-gray-500"><X className="w-3 h-3" /></button>}
            </div>
            <select
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-[12px] text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-gray-300"
              value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Validated">Validated</option>
              <option value="Discrepancy">Discrepancy</option>
            </select>
          </div>
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {results.length > 0 ? results.map((e: Entry) => {
              const age = agingBadge(e.date);
              return (
                <div key={e.ref} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-100 hover:bg-gray-50">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-mono text-gray-400">{e.ref}</p>
                    <p className="text-[12px] font-medium text-gray-800 truncate">{e.program}</p>
                    <p className="text-[11px] text-gray-400">{e.coordinator} · {e.budget} · {e.target}</p>
                    {e.discrepancyNote && <p className="text-[11px] text-red-500 mt-0.5">{e.discrepancyNote}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[e.status as keyof typeof statusColor]}`}>{e.status}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${age.cls}`}>{age.label}</span>
                  </div>
                </div>
              );
            }) : (
              <p className="text-[12px] text-gray-400 text-center py-6">No records match your search.</p>
            )}
          </div>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
          <p className="text-[11px] text-gray-400">{results.length} of {entries.length} records</p>
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Close</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

interface BoardModalProps {
  entries: Entry[];
  onClose: () => void;
  onOpenModal: (modal: string) => void;
  onSelectRef: (ref: string) => void;
}

/* ── View All / Board Modal ── */
function BoardModal({ entries, onClose, onOpenModal, onSelectRef }: BoardModalProps) {
  const COLS = ["Pending", "In Progress", "Validated", "Discrepancy"];
  const colCfg = {
    "Pending":     { icon: Database,     accent: "#3b82f6", bg: "bg-blue-50",  border: "border-blue-200",  text: "text-blue-700",  count: "bg-blue-100 text-blue-700"   },
    "In Progress": { icon: Clock,        accent: "#f59e0b", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", count: "bg-amber-100 text-amber-700" },
    "Validated":   { icon: CheckCircle,  accent: "#22c55e", bg: "bg-green-50", border: "border-green-200", text: "text-green-700", count: "bg-green-100 text-green-700" },
    "Discrepancy": { icon: AlertCircle,  accent: "#ef4444", bg: "bg-red-50",   border: "border-red-200",   text: "text-red-700",   count: "bg-red-100 text-red-700"     },
  };

  function handleAction(type: string, ref: string) {
    onSelectRef(ref);
    onClose();
    onOpenModal(type);
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white border border-gray-200 rounded-xl w-[760px] max-w-[95vw] shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-[14px] font-semibold text-gray-900">PMIS Entry Board · FY 2026</h2>
            <p className="text-[11px] text-gray-400">{entries.length} total entries</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 overflow-x-auto">
          <div className="flex gap-3 min-w-[640px]">
            {COLS.map((status: string) => {
              const cfg = colCfg[status as keyof typeof colCfg];
              const Icon = cfg.icon;
              const items = entries.filter((e: Entry) => e.status === status as Entry["status"]);
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
                    {items.length > 0 ? items.map((e: Entry) => {
                      const age = agingBadge(e.date);
                      const canAct = e.status === "Pending" || e.status === "In Progress";
                      return (
                        <div key={e.ref} className="bg-white border border-gray-200 rounded-lg p-2.5 space-y-1.5 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-[10px] font-mono text-gray-400">{e.ref}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border flex-shrink-0 ${age.cls}`}>{age.label}</span>
                          </div>
                          <p className="text-[11px] font-medium text-gray-800 leading-tight">{e.program}</p>
                          <p className="text-[11px] text-gray-400">{e.coordinator}</p>
                          {e.discrepancyNote && <p className="text-[10px] text-red-500 leading-tight">{e.discrepancyNote}</p>}
                          {canAct && (
                            <div className="flex gap-1 pt-1 border-t border-gray-100">
                              <button onClick={() => handleAction("validate", e.ref)}
                                className="flex-1 py-0.5 text-[10px] rounded bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 flex items-center justify-center gap-1">
                                <Check className="w-2.5 h-2.5" /> Validate
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
export default function PMISCoordinatorDashboard() {
  const [entries, setEntries]      = useState<Entry[]>(initialEntries);
  const [selectedRef, setSelected] = useState<string | null>(null);
  const [modal, setModal]          = useState<string | null>(null);
  const [toast, setToast]          = useState<{ visible: boolean; message: string; type: "green" | "red" | "blue" | "amber" }>({ visible: false, message: "", type: "green" });

  const showToast = (message: string, type: "green" | "red" | "blue" | "amber" = "green") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  const handleValidate = (ref: string) => {
    setEntries((prev) => prev.map((e) => e.ref === ref ? { ...e, status: "Validated" } : e));
    setSelected(null); setModal(null);
    showToast(`✓ ${ref} validated and cleared for PMIS encoding`, "green");
  };

  const handleUpload = (data: { ref: string; program: string; coordinator: string; budget: string; target: string }) => {
    const newEntry: Entry = {
      ref: data.ref, program: data.program, coordinator: data.coordinator,
      status: "Pending", date: "May 24", budget: data.budget, target: data.target, discrepancyNote: "",
    };
    setEntries((prev) => [...prev, newEntry]);
    setModal(null);
    showToast(`↑ ${data.ref} submitted for review`, "blue");
  };

  const stats: Array<{ label: string; value: number; sub: string; icon: typeof Database; color: "blue" | "amber" | "green" | "red" }> = [
    { label: "For PMIS Validation", value: entries.filter((e: Entry) => e.status === "Pending").length,                                 sub: "data entries pending",  icon: Database,    color: "blue"  },
    { label: "In Progress",         value: entries.filter((e: Entry) => e.status === "In Progress").length,                             sub: "currently reviewing",   icon: Clock,       color: "amber" },
    { label: "Validated",           value: entries.filter((e: Entry) => e.status === "Validated").length,                               sub: "entries approved",      icon: CheckCircle, color: "green" },
    { label: "Discrepancies",       value: entries.filter((e: Entry) => e.status === "Discrepancy").length,                             sub: "data mismatches found", icon: AlertCircle, color: "red"   },
  ];

  const discrepantItems = entries.filter((e: Entry) => e.status === "Discrepancy");

  const quickActions = [
    { label: "Validate Entry", icon: CheckCircle, key: "validate", hoverCls: "hover:bg-green-50 hover:border-green-200 hover:text-green-700" },
    { label: "Upload Data",    icon: Upload,      key: "upload",   hoverCls: "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"   },
    { label: "Sync PMIS",      icon: RefreshCw,   key: "sync",     hoverCls: "hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700" },
    { label: "Search Records", icon: Search,      key: "search",   hoverCls: "hover:bg-gray-50 hover:border-gray-200"                        },
  ];

  return (
    <main className="p-4 sm:p-6 space-y-6">
      <div>
        <h2 className="text-[15px] font-semibold text-gray-900">PMIS Coordination</h2>
        <p className="text-[12px] text-gray-400 mt-0.5">Data validation and PMIS synchronization · FY 2026</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
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

      {/* Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Entry Queue */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-gray-800">PMIS Entry Queue</span>
            <button onClick={() => setModal("board")} className="text-[11px] text-blue-600 hover:underline flex items-center gap-1">
              <LayoutGrid className="w-3 h-3" /> View all
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {entries.map((e) => (
              <div key={e.ref}
                onClick={() => setSelected(selectedRef === e.ref ? null : e.ref)}
                className={`px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${selectedRef === e.ref ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-400 font-mono">{e.ref}</p>
                  <p className="text-[12px] font-medium text-gray-800 truncate">{e.program}</p>
                  <p className="text-[11px] text-gray-400">{e.coordinator}</p>
                  {e.discrepancyNote && <p className="text-[11px] text-red-500 mt-0.5 truncate">{e.discrepancyNote}</p>}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[e.status]}`}>{e.status}</span>
                  <span className="text-[10px] text-gray-300">{e.date}</span>
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
                {(entries.find((e) => e.ref === selectedRef)?.status === "Pending" ||
                  entries.find((e) => e.ref === selectedRef)?.status === "In Progress") && (
                  <button onClick={() => setModal("validate")}
                    className="px-2.5 py-1 text-[11px] rounded-md bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Validate
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

        {/* Quick Actions + Alerts */}
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
            {discrepantItems.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-md p-3">
                <p className="text-[11px] font-semibold text-red-700 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {discrepantItems.length} discrepanc{discrepantItems.length === 1 ? "y" : "ies"}
                </p>
                {discrepantItems.map((d) => (
                  <p key={d.ref} className="text-[11px] text-red-600 mt-0.5">
                    <span className="font-mono">{d.ref}</span> — {d.discrepancyNote}
                  </p>
                ))}
              </div>
            )}
            {discrepantItems.length === 0 && (
              <div className="bg-green-50 border border-green-100 rounded-md p-3">
                <p className="text-[11px] font-semibold text-green-700">No discrepancies</p>
                <p className="text-[11px] text-green-600 mt-0.5">All entries are consistent with PMIS records.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === "validate" && <ValidateModal entries={entries} selectedRef={selectedRef} onSelect={setSelected} onValidate={handleValidate} onClose={() => setModal(null)} />}
      {modal === "upload"   && <UploadModal   onUpload={handleUpload} onClose={() => setModal(null)} />}
      {modal === "sync"     && <SyncModal     entries={entries} onClose={() => setModal(null)} showToast={showToast} />}
      {modal === "search"   && <SearchModal   entries={entries} onClose={() => setModal(null)} />}
      {modal === "board"    && <BoardModal    entries={entries} onClose={() => setModal(null)} onOpenModal={setModal} onSelectRef={setSelected} />}

      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </main>
  );
}