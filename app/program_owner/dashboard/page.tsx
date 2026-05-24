"use client";

import { useState, useRef } from "react";
import {
  FileText, Clock, CheckCircle, XCircle,
  PlusCircle, Send, Eye, BarChart2,
  X, Upload, Download, ChevronRight,
  Save, RotateCcw, AlertCircle, Check,
  FileSpreadsheet, Trash2,
} from "lucide-react";
import * as XLSX from "xlsx";

// ── seed data ─────────────────────────────────────────────────────────────────
const initialPPAs = [
  { code:"PPA-2026-001", title:"School-Based Feeding Program",       status:"Approved",      updated:"May 10", budget:"₱320,000",  objective:"Improve nutrition of learners",          office:"Curriculum",    quarter:"Q1" },
  { code:"PPA-2026-002", title:"Brigada Eskwela Implementation",     status:"Pending PMT",   updated:"May 18", budget:"₱85,000",   objective:"Mobilize community for school upkeep",   office:"SGD",           quarter:"Q2" },
  { code:"PPA-2026-003", title:"ALS Mobile Teacher Deployment",      status:"Pending Chief", updated:"May 19", budget:"₱210,000",  objective:"Reach out-of-school youth in communities",office:"ALS",          quarter:"Q1" },
  { code:"PPA-2026-004", title:"SPED Resource Room Procurement",     status:"Returned",      updated:"May 20", budget:"₱150,000",  objective:"Equip SPED classrooms with materials",   office:"SPED Unit",     quarter:"Q3" },
  { code:"PPA-2026-005", title:"Senior High Work Immersion Program", status:"Approved",      updated:"May 15", budget:"₱95,000",   objective:"Provide industry exposure to SHS learners",office:"SHS Unit",    quarter:"Q2" },
];

const statusColor = {
  "Pending PMT":   "bg-blue-50 text-blue-700",
  "Pending Chief": "bg-amber-50 text-amber-700",
  "Approved":      "bg-green-50 text-green-700",
  "Returned":      "bg-red-50 text-red-700",
};

const colorMap = {
  blue:  "bg-blue-50 text-blue-700 border-blue-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  green: "bg-green-50 text-green-700 border-green-100",
  red:   "bg-red-50 text-red-700 border-red-100",
};

const OFFICES  = ["Curriculum","SGD","ALS","SPED Unit","SHS Unit","Finance","Procurement","HR","ICT","M&E"];
const QUARTERS = ["Q1","Q2","Q3","Q4"];

// ── helpers ──────────────────────────────────────────────────────────────────
function nextCode(ppas) {
  const nums = ppas.map((p) => parseInt(p.code.split("-")[2]) || 0);
  const next  = (Math.max(0, ...nums) + 1).toString().padStart(3, "0");
  return `PPA-2026-${next}`;
}

function today() {
  return new Date().toLocaleDateString("en-PH", { month:"short", day:"numeric" });
}

// ── shared UI ─────────────────────────────────────────────────────────────────
function Toast({ message, type, visible }) {
  if (!visible) return null;
  const c = { green:"bg-green-50 text-green-700 border-green-200", red:"bg-red-50 text-red-700 border-red-200", blue:"bg-blue-50 text-blue-700 border-blue-200", amber:"bg-amber-50 text-amber-700 border-amber-200" };
  return (
    <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg border text-[12px] font-medium shadow-sm ${c[type]}`}>
      {message}
    </div>
  );
}

function Backdrop({ onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className={`${wide ? "w-[680px]" : "w-[480px]"} max-w-[97vw]`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ModalShell({ title, icon: Icon, iconColor, onClose, children, footer, wide }) {
  return (
    <Backdrop onClose={onClose} wide={wide}>
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <Icon className={`w-4 h-4 ${iconColor}`} />{title}
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 max-h-[75vh] overflow-y-auto">{children}</div>
        {footer && <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">{footer}</div>}
      </div>
    </Backdrop>
  );
}

// ── New PPA modal (with Excel drop) ──────────────────────────────────────────
function NewPPAModal({ ppas, setPPAs, onClose, toast }) {
  const emptyForm = { title:"", office:OFFICES[0], quarter:QUARTERS[0], budget:"", objective:"" };
  const [form, setForm]         = useState(emptyForm);
  const [tab, setTab]           = useState("manual"); // "manual" | "excel"
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview]   = useState([]); // rows parsed from excel
  const [importing, setImporting] = useState(false);
  const fileRef = useRef();

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = () => {
    if (!form.title.trim()) return;
    const entry = { code: nextCode(ppas), ...form, status:"Pending PMT", updated: today() };
    setPPAs((p) => [...p, entry]);
    toast(`${entry.code} submitted successfully`, "green");
    onClose();
  };

  // ── Excel parsing ──────────────────────────────────────────────────────────
  const parseFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb   = XLSX.read(e.target.result, { type:"binary" });
        const ws   = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval:"" });
        // normalise: accept any column order, map common header names
        const norm = rows.map((r) => {
          const get = (...keys) => {
            for (const k of keys) {
              const found = Object.keys(r).find((rk) => rk.trim().toLowerCase() === k.toLowerCase());
              if (found) return String(r[found]).trim();
            }
            return "";
          };
          return {
            title:     get("title","ppa title","program","activity","project"),
            office:    get("office","implementing office","office/unit"),
            quarter:   get("quarter","q","implementation quarter"),
            budget:    get("budget","amount","total budget","cost"),
            objective: get("objective","description","details","remarks"),
          };
        }).filter((r) => r.title);
        setPreview(norm.slice(0, 20)); // cap at 20 rows
      } catch {
        toast("Could not read file. Please use a valid .xlsx or .csv file.", "red");
      }
    };
    reader.readAsBinaryString(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) parseFile(file);
  };

  const onFileInput = (e) => {
    const file = e.target.files[0];
    if (file) parseFile(file);
  };

  const importAll = () => {
    if (!preview.length) return;
    setImporting(true);
    const newEntries = preview.map((row, i) => ({
      code:      nextCode([...ppas, ...Array(i).fill({ code:`PPA-2026-${999 - i}` })]),
      title:     row.title     || `Imported PPA ${i + 1}`,
      office:    OFFICES.includes(row.office) ? row.office : OFFICES[0],
      quarter:   QUARTERS.includes(row.quarter) ? row.quarter : "Q1",
      budget:    row.budget    ? (row.budget.startsWith("₱") ? row.budget : `₱${row.budget}`) : "—",
      objective: row.objective || "",
      status:    "Pending PMT",
      updated:   today(),
    }));
    // recalculate codes properly
    let base = [...ppas];
    const final = newEntries.map((entry) => {
      const code = nextCode(base);
      const e = { ...entry, code };
      base = [...base, e];
      return e;
    });
    setPPAs((p) => [...p, ...final]);
    toast(`${final.length} PPA${final.length > 1 ? "s" : ""} imported successfully`, "green");
    setImporting(false);
    onClose();
  };

  return (
    <ModalShell title="New PPA / PAP" icon={PlusCircle} iconColor="text-blue-600" onClose={onClose} wide
      footer={
        tab === "manual"
          ? <><button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={submit} disabled={!form.title.trim()}
                className={`px-3 py-1.5 text-[12px] rounded-lg flex items-center gap-1.5 border ${form.title.trim() ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"}`}>
                <Send className="w-3.5 h-3.5"/> Submit PPA
              </button></>
          : preview.length > 0
            ? <><button onClick={() => setPreview([])} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Clear</button>
                <button onClick={importAll} disabled={importing}
                  className="px-3 py-1.5 text-[12px] rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5"/> Import {preview.length} Row{preview.length > 1 ? "s" : ""}
                </button></>
            : <button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
      }
    >
      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg">
        {[["manual","Manual Entry"],["excel","Import from Excel"]].map(([k, label]) => (
          <button key={k} onClick={() => { setTab(k); setPreview([]); }}
            className={`flex-1 py-1.5 text-[12px] rounded-md transition-colors font-medium ${tab === k ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "manual" && (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] text-gray-400 mb-1">PPA / Program Title <span className="text-red-400">*</span></label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-300"
              placeholder="e.g. School-Based Feeding Program" value={form.title} onChange={f("title")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Implementing Office</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"
                value={form.office} onChange={f("office")}>
                {OFFICES.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Implementation Quarter</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"
                value={form.quarter} onChange={f("quarter")}>
                {QUARTERS.map((q) => <option key={q}>{q}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Budget Amount</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-300"
              placeholder="e.g. ₱125,000" value={form.budget} onChange={f("budget")} />
          </div>
          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Objective / Description</label>
            <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] resize-none focus:outline-none focus:ring-1 focus:ring-blue-300"
              rows={3} placeholder="Describe the program's objective…" value={form.objective} onChange={f("objective")} />
          </div>
        </div>
      )}

      {tab === "excel" && preview.length === 0 && (
        <div>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragging ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/40"}`}
          >
            <FileSpreadsheet className={`w-10 h-10 mx-auto mb-3 ${dragging ? "text-blue-500" : "text-gray-300"}`} />
            <p className="text-[13px] font-medium text-gray-600">Drop your Excel file here</p>
            <p className="text-[11px] text-gray-400 mt-1">or click to browse · .xlsx, .xls, .csv accepted</p>
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={onFileInput} />
          </div>

          <div className="mt-4 bg-gray-50 border border-gray-100 rounded-lg p-3">
            <p className="text-[11px] font-semibold text-gray-600 mb-2">Expected columns (any order):</p>
            <div className="flex flex-wrap gap-1.5">
              {["Title","Office","Quarter","Budget","Objective"].map((c) => (
                <span key={c} className="text-[10px] font-mono bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded">{c}</span>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">Column names are case-insensitive. Extra columns are ignored.</p>
          </div>

          <button onClick={() => {
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet([
              ["Title","Office","Quarter","Budget","Objective"],
              ["School Feeding Program","Curriculum","Q1","₱120,000","Provide nutritious meals to learners"],
              ["Brigada Eskwela","SGD","Q2","₱80,000","Community school cleanup drive"],
            ]);
            XLSX.utils.book_append_sheet(wb, ws, "PPAs");
            XLSX.writeFile(wb, "ppa_template.xlsx");
          }} className="mt-3 w-full py-2 text-[12px] rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-2">
            <Download className="w-3.5 h-3.5"/> Download Template
          </button>
        </div>
      )}

      {tab === "excel" && preview.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Check className="w-4 h-4 text-green-500"/>
            <p className="text-[12px] font-semibold text-green-700">{preview.length} row{preview.length > 1 ? "s" : ""} parsed from file</p>
          </div>
          <div className="rounded-lg border border-gray-100 overflow-hidden">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-3 py-2 text-left text-gray-400 font-medium">Title</th>
                  <th className="px-3 py-2 text-left text-gray-400 font-medium">Office</th>
                  <th className="px-3 py-2 text-left text-gray-400 font-medium">Quarter</th>
                  <th className="px-3 py-2 text-left text-gray-400 font-medium">Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {preview.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-800 max-w-[160px] truncate">{r.title || <span className="text-red-400 italic">missing</span>}</td>
                    <td className="px-3 py-2 text-gray-500">{r.office || "—"}</td>
                    <td className="px-3 py-2 text-gray-500">{r.quarter || "—"}</td>
                    <td className="px-3 py-2 text-gray-600 font-medium">{r.budget || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">All rows will be submitted as <span className="font-semibold">Pending PMT</span> status.</p>
        </div>
      )}
    </ModalShell>
  );
}

// ── Submit WFP modal ──────────────────────────────────────────────────────────
function SubmitWFPModal({ ppas, onClose, toast }) {
  const approved = ppas.filter((p) => p.status === "Approved");
  const [selected, setSelected] = useState([]);
  const [period, setPeriod]     = useState("Q1 2026");
  const [remarks, setRemarks]   = useState("");

  const toggle = (code) => setSelected((p) => p.includes(code) ? p.filter((c) => c !== code) : [...p, code]);

  const submit = () => {
    if (!selected.length) return;
    toast(`WFP submitted for ${selected.length} PPA${selected.length > 1 ? "s" : ""} (${period})`, "green");
    onClose();
  };

  return (
    <ModalShell title="Submit Work and Financial Plan" icon={Send} iconColor="text-blue-600" onClose={onClose}
      footer={<><button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={submit} disabled={!selected.length}
          className={`px-3 py-1.5 text-[12px] rounded-lg flex items-center gap-1.5 border ${selected.length ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"}`}>
          <Send className="w-3.5 h-3.5"/> Submit WFP
        </button></>}
    >
      <div className="space-y-3">
        <div>
          <label className="block text-[11px] text-gray-400 mb-1">Reporting Period</label>
          <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] bg-white focus:outline-none"
            value={period} onChange={(e) => setPeriod(e.target.value)}>
            {["Q1 2026","Q2 2026","Q3 2026","Q4 2026"].map((q) => <option key={q}>{q}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[11px] text-gray-400 mb-1">Select Approved PPAs to include</label>
          {approved.length === 0 ? (
            <p className="text-[12px] text-gray-400 text-center py-4">No approved PPAs available.</p>
          ) : (
            <div className="space-y-1.5 max-h-44 overflow-y-auto">
              {approved.map((p) => (
                <label key={p.code} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${selected.includes(p.code) ? "bg-blue-50 border-blue-100" : "border-gray-100 hover:bg-gray-50"}`}>
                  <input type="checkbox" checked={selected.includes(p.code)} onChange={() => toggle(p.code)} className="w-3 h-3 accent-blue-600" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-mono text-gray-400">{p.code}</p>
                    <p className="text-[12px] font-medium text-gray-800 truncate">{p.title}</p>
                  </div>
                  <span className="text-[11px] text-gray-500 flex-shrink-0">{p.budget}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block text-[11px] text-gray-400 mb-1">Remarks</label>
          <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
            rows={2} placeholder="Optional remarks for the Budget Officer…"
            value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </div>
      </div>
    </ModalShell>
  );
}

// ── View All PPAs modal ───────────────────────────────────────────────────────
function ViewAllModal({ ppas, setPPAs, onClose, toast }) {
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const statuses = ["All","Pending PMT","Pending Chief","Approved","Returned"];
  const filtered = filter === "All" ? ppas : ppas.filter((p) => p.status === filter);

  const saveEdit = () => {
    setPPAs((prev) => prev.map((p) => p.code === editId ? { ...p, ...editForm, updated: today() } : p));
    toast("PPA updated", "green");
    setEditId(null);
  };

  const deletePPA = (code) => {
    setPPAs((prev) => prev.filter((p) => p.code !== code));
    toast("PPA removed", "red");
  };

  const resubmit = (code) => {
    setPPAs((prev) => prev.map((p) => p.code === code ? { ...p, status:"Pending PMT", updated:today() } : p));
    toast(`${code} resubmitted`, "blue");
  };

  return (
    <ModalShell title="All My PPAs / PAPs" icon={Eye} iconColor="text-gray-500" onClose={onClose} wide
      footer={<button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Close</button>}>
      <div className="space-y-3">
        <div className="flex gap-1.5 flex-wrap">
          {statuses.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-2.5 py-1 text-[11px] rounded-full border transition-colors ${filter === s ? "bg-gray-800 text-white border-gray-800" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="divide-y divide-gray-50 rounded-lg border border-gray-100 overflow-hidden">
          {filtered.map((p) => (
            <div key={p.code} className="px-3 py-3 hover:bg-gray-50">
              {editId === p.code ? (
                <div className="space-y-2">
                  <input className="w-full border border-gray-200 rounded px-2 py-1 text-[12px] focus:outline-none"
                    value={editForm.title ?? p.title} onChange={(e) => setEditForm((f) => ({ ...f, title:e.target.value }))} />
                  <div className="grid grid-cols-3 gap-2">
                    <select className="border border-gray-200 rounded px-2 py-1 text-[12px] bg-white focus:outline-none"
                      value={editForm.office ?? p.office} onChange={(e) => setEditForm((f) => ({ ...f, office:e.target.value }))}>
                      {OFFICES.map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <select className="border border-gray-200 rounded px-2 py-1 text-[12px] bg-white focus:outline-none"
                      value={editForm.quarter ?? p.quarter} onChange={(e) => setEditForm((f) => ({ ...f, quarter:e.target.value }))}>
                      {QUARTERS.map((q) => <option key={q}>{q}</option>)}
                    </select>
                    <input className="border border-gray-200 rounded px-2 py-1 text-[12px] focus:outline-none"
                      placeholder="Budget" value={editForm.budget ?? p.budget} onChange={(e) => setEditForm((f) => ({ ...f, budget:e.target.value }))} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="px-3 py-1 text-[11px] rounded bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 flex items-center gap-1"><Check className="w-3 h-3"/>Save</button>
                    <button onClick={() => setEditId(null)} className="px-3 py-1 text-[11px] rounded border border-gray-200 text-gray-500 hover:bg-gray-50">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-mono text-gray-400">{p.code}</p>
                    <p className="text-[12px] font-medium text-gray-800 truncate">{p.title}</p>
                    <p className="text-[11px] text-gray-400">{p.office} · {p.quarter} · {p.budget || "—"}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${statusColor[p.status]}`}>{p.status}</span>
                  <div className="flex gap-1 flex-shrink-0">
                    {p.status === "Returned" && (
                      <button onClick={() => resubmit(p.code)} title="Resubmit" className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                        <RotateCcw className="w-3.5 h-3.5"/>
                      </button>
                    )}
                    <button onClick={() => { setEditId(p.code); setEditForm({}); }} className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                      <FileText className="w-3.5 h-3.5"/>
                    </button>
                    <button onClick={() => deletePPA(p.code)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-3.5 h-3.5"/>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-[12px] text-gray-400 text-center py-6">No PPAs match this filter.</p>
          )}
        </div>
        <p className="text-[11px] text-gray-400 text-right">{filtered.length} of {ppas.length} shown</p>
      </div>
    </ModalShell>
  );
}

// ── Reports modal ─────────────────────────────────────────────────────────────
function ReportsModal({ ppas, onClose }) {
  const total    = ppas.length;
  const approved = ppas.filter((p) => p.status === "Approved").length;
  const returned = ppas.filter((p) => p.status === "Returned").length;
  const pending  = ppas.filter((p) => p.status === "Pending PMT" || p.status === "Pending Chief").length;
  const rate     = total > 0 ? Math.round((approved / total) * 100) : 0;

  return (
    <ModalShell title="My Program Reports" icon={BarChart2} iconColor="text-gray-500" onClose={onClose}
      footer={<><button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Close</button>
        <button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5"/> Export PDF
        </button></>}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label:"Total PPAs",    value:total,    cls:"bg-blue-50 border-blue-100 text-blue-700"  },
            { label:"Approved",      value:approved, cls:"bg-green-50 border-green-100 text-green-700" },
            { label:"Pending",       value:pending,  cls:"bg-amber-50 border-amber-100 text-amber-700" },
            { label:"Returned",      value:returned, cls:"bg-red-50 border-red-100 text-red-700"     },
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
            <div className="bg-green-500 h-full rounded-full" style={{ width:`${rate}%` }} />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">{rate}% of your PPAs have been fully approved</p>
        </div>

        <div className="border-t border-gray-100 pt-3">
          <p className="text-[11px] text-gray-400 font-medium mb-2">By quarter</p>
          {["Q1","Q2","Q3","Q4"].map((q) => {
            const count = ppas.filter((p) => p.quarter === q).length;
            return (
              <div key={q} className="flex items-center gap-3 mb-1.5">
                <span className="text-[11px] text-gray-500 w-8">{q}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-400 h-full rounded-full" style={{ width: total > 0 ? `${Math.round((count / total) * 100)}%` : "0%" }} />
                </div>
                <span className="text-[11px] text-gray-400 w-12 text-right">{count} PPA{count !== 1 ? "s" : ""}</span>
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-100 pt-3">
          <p className="text-[11px] text-gray-400 font-medium mb-2">By implementing office</p>
          <div className="space-y-1">
            {[...new Set(ppas.map((p) => p.office))].map((o) => (
              <div key={o} className="flex items-center justify-between text-[12px]">
                <span className="text-gray-600">{o}</span>
                <span className="text-gray-400">{ppas.filter((p) => p.office === o).length} PPA{ppas.filter((p) => p.office === o).length !== 1 ? "s" : ""}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ProgramOwnerDashboard() {
  const [ppas, setPPAs]    = useState(initialPPAs);
  const [modal, setModal]  = useState(null);
  const [toast, setToastS] = useState({ visible:false, message:"", type:"green" });

  const showToast = (message, type = "green") => {
    setToastS({ visible:true, message, type });
    setTimeout(() => setToastS((t) => ({ ...t, visible:false })), 2800);
  };

  const stats = [
    { label:"My PPAs / PAPs",  value:ppas.length,                                                               sub:"submitted this FY",     icon:FileText,    color:"blue"  },
    { label:"Pending Review",  value:ppas.filter((p)=>p.status==="Pending PMT"||p.status==="Pending Chief").length, sub:"awaiting validator", icon:Clock,       color:"amber" },
    { label:"Approved",        value:ppas.filter((p)=>p.status==="Approved").length,                             sub:"fully approved by SDS", icon:CheckCircle, color:"green" },
    { label:"Returned",        value:ppas.filter((p)=>p.status==="Returned").length,                             sub:"needs revision",        icon:XCircle,     color:"red"   },
  ];

  const returnedItems  = ppas.filter((p) => p.status === "Returned");
  const displayPPAs    = ppas.slice(0, 5);

  const quickActions = [
    { label:"New PPA",       icon:PlusCircle, key:"new",     hoverCls:"hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"  },
    { label:"Submit WFP",    icon:Send,       key:"wfp",     hoverCls:"hover:bg-green-50 hover:border-green-200 hover:text-green-700" },
    { label:"View All PPAs", icon:Eye,        key:"viewAll", hoverCls:"hover:bg-gray-50 hover:border-gray-200"                       },
    { label:"My Reports",    icon:BarChart2,  key:"reports", hoverCls:"hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"   },
  ];

  return (
    <main className="p-4 sm:p-6 space-y-6">
      <div>
        <h2 className="text-[15px] font-semibold text-gray-900">My Programs Dashboard</h2>
        <p className="text-[12px] text-gray-400 mt-0.5">Track your PAPs, WFPs, and submission status · FY 2026</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-gray-500">{s.label}</span>
              <span className={`w-7 h-7 flex items-center justify-center rounded-md border text-xs ${colorMap[s.color]}`}>
                <s.icon className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-[22px] font-semibold text-gray-900 leading-none">{s.value}</p>
            <p className="text-[11px] text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* PPA List */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-gray-800">My PPAs / PAPs</span>
            <button onClick={() => setModal("viewAll")} className="text-[11px] text-blue-600 hover:underline">View all</button>
          </div>
          <div className="divide-y divide-gray-50">
            {displayPPAs.map((p) => (
              <div key={p.code} className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setModal("viewAll")}>
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-400 font-mono">{p.code}</p>
                  <p className="text-[12px] font-medium text-gray-800 truncate">{p.title}</p>
                  <p className="text-[11px] text-gray-400">{p.office} · {p.quarter}{p.budget ? ` · ${p.budget}` : ""}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[p.status]}`}>{p.status}</span>
                  <span className="text-[10px] text-gray-300">{p.updated}</span>
                </div>
              </div>
            ))}
          </div>
          {ppas.length > 5 && (
            <div className="px-4 py-2.5 border-t border-gray-100">
              <button onClick={() => setModal("viewAll")} className="text-[11px] text-blue-600 hover:underline flex items-center gap-1">
                View {ppas.length - 5} more PPAs <ChevronRight className="w-3 h-3"/>
              </button>
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
          <div className="px-4 pb-4 space-y-2">
            {returnedItems.length > 0 ? (
              <div className="bg-amber-50 border border-amber-100 rounded-md p-3">
                <p className="text-[11px] font-semibold text-amber-700 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5"/> Action needed
                </p>
                <p className="text-[11px] text-amber-600 mt-0.5">
                  {returnedItems.map((p) => p.code).join(", ")} {returnedItems.length > 1 ? "were" : "was"} returned. Please revise and resubmit.
                </p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-100 rounded-md p-3">
                <p className="text-[11px] font-semibold text-green-700">All good!</p>
                <p className="text-[11px] text-green-600 mt-0.5">No returned PPAs at this time.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === "new"     && <NewPPAModal  ppas={ppas} setPPAs={setPPAs} onClose={() => setModal(null)} toast={showToast} />}
      {modal === "wfp"     && <SubmitWFPModal ppas={ppas}                 onClose={() => setModal(null)} toast={showToast} />}
      {modal === "viewAll" && <ViewAllModal ppas={ppas} setPPAs={setPPAs} onClose={() => setModal(null)} toast={showToast} />}
      {modal === "reports" && <ReportsModal ppas={ppas}                   onClose={() => setModal(null)} />}

      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </main>
  );
}