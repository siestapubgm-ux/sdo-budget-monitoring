"use client";

import { useState, ReactNode } from "react";
import {
  Users, ShieldCheck, Activity, AlertCircle,
  Settings, Database, Key, RefreshCw,
  X, Plus, Trash2, Edit2, Check, Eye, EyeOff,
  Download, Upload, RotateCcw, Save, Copy,
} from "lucide-react";

// ── seed data ──────────────────────────────────────────────────────────────
const ROLES = ["System Admin","Budget Officer","Accountant","Functional Chief","ASDS","SDS","Program Owner","PMT Validator","Auditor","Finance Officer","Viewer"];

const initialUsers = [
  { id:1, name:"Ej Bancud",   email:"ej.bancud@sdo.local",   role:"Budget Officer",   status:"Active",   lastSeen:"2 min ago"  },
  { id:2, name:"Ana Reyes",   email:"ana.reyes@sdo.local",   role:"Program Owner",    status:"Active",   lastSeen:"14 min ago" },
  { id:3, name:"Mark Santos", email:"mark.santos@sdo.local", role:"PMT Validator",    status:"Active",   lastSeen:"32 min ago" },
  { id:4, name:"Lia Cruz",    email:"lia.cruz@sdo.local",    role:"System Admin",     status:"Active",   lastSeen:"1 hr ago"   },
  { id:5, name:"Ben Quinto",  email:"ben.quinto@sdo.local",  role:"Accountant",       status:"Inactive", lastSeen:"2 hr ago"   },
  { id:6, name:"Carla Basa",  email:"carla.basa@sdo.local",  role:"Functional Chief", status:"Active",   lastSeen:"3 hr ago"   },
  { id:7, name:"Ramon Delos", email:"ramon.delos@sdo.local", role:"ASDS",             status:"Active",   lastSeen:"5 hr ago"   },
  { id:8, name:"Nina Viray",  email:"nina.viray@sdo.local",  role:"SDS",              status:"Active",   lastSeen:"Yesterday"  },
];

const initialAlerts = [
  { id:1, title:"Failed login attempts",  desc:"5 failed logins for ben.quinto@sdo.local", level:"red"   },
  { id:2, title:"Database backup overdue",desc:"Last backup was 8 days ago",               level:"amber" },
  { id:3, title:"API key expiring soon",  desc:"BMS-KEY-003 expires in 3 days",            level:"amber" },
];

const initialApiKeys = [
  { id:1, name:"BMS-KEY-001", key:"bms_live_k1_••••••••••••••••", created:"Jan 10, 2026", expires:"Jan 10, 2027", status:"Active"  },
  { id:2, name:"BMS-KEY-002", key:"bms_live_k2_••••••••••••••••", created:"Feb 3, 2026",  expires:"Feb 3, 2027",  status:"Active"  },
  { id:3, name:"BMS-KEY-003", key:"bms_live_k3_••••••••••••••••", created:"May 1, 2026",  expires:"May 27, 2026", status:"Expiring"},
];

const initialSettings = {
  systemName:       "DepEd BMS",
  fiscalYear:       "2026",
  maxLoginAttempts: "5",
  sessionTimeout:   "30",
  maintenanceMode:  false,
  emailNotifications: true,
};

const initialActivity = [
  { user:"Ej Bancud",   action:"Logged in",              role:"Budget Officer",  time:"2 min ago"  },
  { user:"Ana Reyes",   action:"Submitted PPA #2026-01", role:"Program Owner",   time:"14 min ago" },
  { user:"Mark Santos", action:"Validated ORS #0045",    role:"PMT Validator",   time:"32 min ago" },
  { user:"Lia Cruz",    action:"Role updated",           role:"System Admin",    time:"1 hr ago"   },
  { user:"Ben Quinto",  action:"Password reset",         role:"Accountant",      time:"2 hr ago"   },
];

// ── helpers ─────────────────────────────────────────────────────────────────
const colorMap = {
  blue:   "bg-blue-50 text-blue-700 border-blue-100",
  green:  "bg-green-50 text-green-700 border-green-100",
  red:    "bg-red-50 text-red-700 border-red-100",
  purple: "bg-purple-50 text-purple-700 border-purple-100",
};

function initials(name: string): string {
  return name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
}

// ── shared UI ────────────────────────────────────────────────────────────────
type ToastType = "green" | "red" | "blue" | "amber";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastSeen: string;
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

function Backdrop({ onClose, children, wide }: { onClose: () => void; children: ReactNode; wide?: boolean }): JSX.Element {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className={wide ? "w-[680px] max-w-[98vw]" : "w-[460px] max-w-[95vw]"} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ModalShell({ title, icon: Icon, iconColor, onClose, children, footer, wide }: { title: string; icon: any; iconColor: string; onClose: () => void; children: ReactNode; footer?: ReactNode; wide?: boolean }): JSX.Element {
  return (
    <Backdrop onClose={onClose} wide={wide}>
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
            <Icon className={`w-4 h-4 ${iconColor}`} />{title}
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">{footer}</div>}
      </div>
    </Backdrop>
  );
}

// ── Manage Users modal ────────────────────────────────────────────────────────
function ManageUsersModal({ users, setUsers, onClose, toast }: { users: User[]; setUsers: (users: User[]) => void; onClose: () => void; toast: (msg: string, type: ToastType) => void }): JSX.Element {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<User | null>(null);
  const [adding, setAdding]   = useState(false);
  const [newUser, setNewUser] = useState({ name:"", email:"", role:ROLES[0] });

  const filtered = users.filter((u: User) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const saveEdit = (): void => {
    if (editing) {
      setUsers(users.map((u: User) => u.id === editing.id ? { ...u, ...editing } : u));
      toast("User updated successfully", "green");
      setEditing(null);
    }
  };

  const deleteUser = (id: number): void => {
    setUsers(users.filter((u: User) => u.id !== id));
    toast("User removed", "red");
  };

  const toggleStatus = (id: number): void => {
    setUsers(users.map((u: User) => u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u));
  };

  const addUser = (): void => {
    if (!newUser.name || !newUser.email) return;
    setUsers([...users, { id: Date.now(), ...newUser, status:"Active", lastSeen:"Just now" }]);
    toast(`${newUser.name} added`, "green");
    setAdding(false);
    setNewUser({ name:"", email:"", role:ROLES[0] });
  };

  return (
    <ModalShell title="Manage Users" icon={Users} iconColor="text-blue-600" onClose={onClose} wide>
      <div className="space-y-3">
        <div className="flex gap-2">
          <input className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] focus:outline-none focus:ring-1 focus:ring-gray-300"
            placeholder="Search users…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button onClick={() => setAdding(true)}
            className="px-3 py-1.5 text-[12px] rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add User
          </button>
        </div>

        {adding && (
          <div className="border border-blue-100 bg-blue-50 rounded-lg p-3 space-y-2">
            <p className="text-[11px] font-semibold text-blue-700">New User</p>
            <input className="w-full border border-gray-200 rounded px-2 py-1 text-[12px] focus:outline-none"
              placeholder="Full name" value={newUser.name} onChange={(e) => setNewUser((p) => ({ ...p, name:e.target.value }))} />
            <input className="w-full border border-gray-200 rounded px-2 py-1 text-[12px] focus:outline-none"
              placeholder="Email" value={newUser.email} onChange={(e) => setNewUser((p) => ({ ...p, email:e.target.value }))} />
            <select className="w-full border border-gray-200 rounded px-2 py-1 text-[12px] bg-white focus:outline-none"
              value={newUser.role} onChange={(e) => setNewUser((p: { name: string; email: string; role: string }) => ({ ...p, role:e.target.value }))}>
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={addUser} className="px-3 py-1 text-[11px] rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1"><Check className="w-3 h-3"/>Save</button>
              <button onClick={() => setAdding(false)} className="px-3 py-1 text-[11px] rounded border border-gray-200 text-gray-500 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        )}

        <div className="divide-y divide-gray-50 rounded-lg border border-gray-100 overflow-hidden">
          {filtered.map((u: User) => (
            <div key={u.id} className="px-3 py-2.5 flex items-center gap-3 hover:bg-gray-50">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-bold text-blue-700">{initials(u.name)}</span>
              </div>
              {editing?.id === u.id ? (
                <div className="flex-1 flex flex-wrap gap-1.5">
                  <input className="border border-gray-200 rounded px-2 py-1 text-[12px] focus:outline-none flex-1 min-w-[120px]"
                    value={editing?.name} onChange={(e) => setEditing((p: User | null) => p ? { ...p, name:e.target.value } : null)} />
                  <select className="border border-gray-200 rounded px-2 py-1 text-[12px] bg-white focus:outline-none"
                    value={editing?.role} onChange={(e) => setEditing((p: User | null) => p ? { ...p, role:e.target.value } : null)}>
                    {ROLES.map((r: string) => <option key={r}>{r}</option>)}
                  </select>
                  <button onClick={saveEdit} className="px-2 py-1 text-[11px] bg-green-50 border border-green-200 text-green-700 rounded hover:bg-green-100 flex items-center gap-1"><Check className="w-3 h-3"/>Save</button>
                  <button onClick={() => setEditing(null)} className="px-2 py-1 text-[11px] border border-gray-200 text-gray-500 rounded hover:bg-gray-50">Cancel</button>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-gray-800 truncate">{u.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{u.email} · {u.role}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${u.status === "Active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-400"}`}>{u.status}</span>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => toggleStatus(u.id)} title="Toggle status" className="p-1 text-gray-400 hover:text-amber-600 rounded hover:bg-amber-50"><Activity className="w-3.5 h-3.5"/></button>
                    <button onClick={() => setEditing({ ...u })} className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"><Edit2 className="w-3.5 h-3.5"/></button>
                    <button onClick={() => deleteUser(u.id)} className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"><Trash2 className="w-3.5 h-3.5"/></button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 text-right">{filtered.length} of {users.length} users shown</p>
      </div>
    </ModalShell>
  );
}

// ── Role Permissions modal ────────────────────────────────────────────────────
const PERMISSIONS = ["View Dashboard","Submit PPA","Submit ORS","Submit DV","Validate Documents","Approve Documents","Recommend Documents","Final Approval","Manage Users","System Settings","View Reports","Export Data"];

function RolePermissionsModal({ onClose, toast }: { onClose: () => void; toast: (msg: string, type: ToastType) => void }): JSX.Element {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [perms, setPerms] = useState<{ [key: string]: string[] }>({
    "System Admin":    PERMISSIONS.slice(),
    "Budget Officer":  ["View Dashboard","Submit PPA","Submit ORS","Submit DV","View Reports"],
    "Accountant":      ["View Dashboard","Validate Documents","View Reports","Export Data"],
    "Functional Chief":["View Dashboard","Approve Documents","View Reports"],
    "ASDS":            ["View Dashboard","Recommend Documents","View Reports"],
    "SDS":             ["View Dashboard","Final Approval","View Reports","Export Data"],
    "Program Owner":   ["View Dashboard","Submit PPA"],
    "PMT Validator":   ["View Dashboard","Validate Documents"],
    "Auditor":         ["View Dashboard","View Reports","Export Data"],
    "Finance Officer": ["View Dashboard","Submit ORS","Submit DV","View Reports"],
    "Viewer":          ["View Dashboard"],
  });

  const toggle = (perm: string): void => {
    setPerms((prev: { [key: string]: string[] }) => {
      const cur = prev[selectedRole] || [];
      return { ...prev, [selectedRole]: cur.includes(perm) ? cur.filter((p: string) => p !== perm) : [...cur, perm] };
    });
  };

  const save = () => { toast(`Permissions saved for ${selectedRole}`, "green"); };

  return (
    <ModalShell title="Role Permissions" icon={ShieldCheck} iconColor="text-purple-600" onClose={onClose} wide
      footer={<><button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button><button onClick={save} className="px-3 py-1.5 text-[12px] rounded-lg bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 flex items-center gap-1.5"><Save className="w-3.5 h-3.5"/>Save Changes</button></>}>
      <div className="flex gap-4">
        <div className="w-40 flex-shrink-0 space-y-1">
          {ROLES.map((r: string) => (
            <button key={r} onClick={() => setSelectedRole(r)}
              className={`w-full text-left px-2.5 py-1.5 text-[11px] rounded-lg transition-colors ${selectedRole === r ? "bg-purple-50 text-purple-700 font-semibold border border-purple-100" : "text-gray-600 hover:bg-gray-50"}`}>
              {r}
            </button>
          ))}
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-semibold text-gray-700 mb-3">{selectedRole}</p>
          <div className="grid grid-cols-2 gap-2">
            {PERMISSIONS.map((p: string) => {
              const active = (perms[selectedRole] || []).includes(p);
              return (
                <label key={p} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${active ? "bg-purple-50 border-purple-100" : "border-gray-100 hover:bg-gray-50"}`}>
                  <input type="checkbox" checked={active} onChange={() => toggle(p)} className="w-3 h-3 accent-purple-600" />
                  <span className="text-[11px] text-gray-700">{p}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

// ── System Settings modal ─────────────────────────────────────────────────────
function SystemSettingsModal({ onClose, toast }: { onClose: () => void; toast: (msg: string, type: ToastType) => void }): JSX.Element {
  const [s, setS] = useState({ ...initialSettings });
  const save = (): void => { toast("Settings saved successfully", "green"); onClose(); };
  const toggle = (k: string): void => setS((p: { [key: string]: any }) => ({ ...p, [k]: !p[k] }));

  return (
    <ModalShell title="System Settings" icon={Settings} iconColor="text-gray-500" onClose={onClose}
      footer={<><button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button><button onClick={save} className="px-3 py-1.5 text-[12px] rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 flex items-center gap-1.5"><Save className="w-3.5 h-3.5"/>Save Settings</button></>}>
      <div className="space-y-4">
        {[["systemName","System Name","text"],["fiscalYear","Fiscal Year","text"],["maxLoginAttempts","Max Login Attempts","number"],["sessionTimeout","Session Timeout (minutes)","number"]].map(([k, label, type]: [string, string, string]) => (
          <div key={k}>
            <label className="block text-[11px] text-gray-400 mb-1">{label}</label>
            <input type={type} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] focus:outline-none focus:ring-1 focus:ring-gray-300"
              value={s[k as keyof typeof s]} onChange={(e) => setS((p: { [key: string]: any }) => ({ ...p, [k]:e.target.value }))} />
          </div>
        ))}
        <div className="border-t border-gray-100 pt-3 space-y-3">
          {[["maintenanceMode","Maintenance Mode","Disables logins for non-admins"],["emailNotifications","Email Notifications","Send alerts via email"]].map(([k, label, desc]: [string, string, string]) => (
            <div key={k} className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-gray-700">{label}</p>
                <p className="text-[11px] text-gray-400">{desc}</p>
              </div>
              <button onClick={() => toggle(k)}
                className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${s[k as keyof typeof s] ? "bg-blue-500" : "bg-gray-200"}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${s[k as keyof typeof s] ? "left-5" : "left-0.5"}`}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}

// ── Database Backup modal ─────────────────────────────────────────────────────
interface BackupFile {
  name: string;
  size: string;
  date: string;
}

function DatabaseBackupModal({ onClose, toast }: { onClose: () => void; toast: (msg: string, type: ToastType) => void }): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const backups: BackupFile[] = [
    { name:"bms_backup_2026-05-16.sql.gz", size:"4.2 MB", date:"May 16, 2026 02:00 AM" },
    { name:"bms_backup_2026-05-09.sql.gz", size:"4.1 MB", date:"May 9, 2026 02:00 AM"  },
    { name:"bms_backup_2026-05-02.sql.gz", size:"3.9 MB", date:"May 2, 2026 02:00 AM"  },
  ];

  const runBackup = (): void => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); toast("Backup completed successfully", "green"); }, 2000);
  };

  return (
    <ModalShell title="Database Backup" icon={Database} iconColor="text-green-600" onClose={onClose}
      footer={<button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Close</button>}>
      <div className="space-y-4">
        <div className={`rounded-lg border p-4 text-center ${done ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100"}`}>
          {done ? (
            <><Check className="w-6 h-6 text-green-500 mx-auto mb-1"/><p className="text-[13px] font-semibold text-green-700">Backup Complete</p><p className="text-[11px] text-green-600 mt-1">bms_backup_2026-05-24.sql.gz · 4.3 MB</p></>
          ) : loading ? (
            <><RotateCcw className="w-6 h-6 text-blue-500 mx-auto mb-1 animate-spin"/><p className="text-[13px] font-semibold text-blue-700">Running backup…</p><p className="text-[11px] text-blue-500 mt-1">Please wait</p></>
          ) : (
            <><Database className="w-6 h-6 text-gray-400 mx-auto mb-1"/><p className="text-[13px] font-semibold text-gray-700">Ready to backup</p><p className="text-[11px] text-gray-400 mt-1">Last backup: May 16, 2026</p></>
          )}
        </div>
        {!done && !loading && (
          <button onClick={runBackup} className="w-full py-2 text-[12px] rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 flex items-center justify-center gap-2">
            <Download className="w-3.5 h-3.5"/> Run Backup Now
          </button>
        )}
        <div>
          <p className="text-[11px] text-gray-400 font-medium mb-2">Previous backups</p>
          <div className="divide-y divide-gray-50 rounded-lg border border-gray-100 overflow-hidden">
            {backups.map((b: BackupFile) => (
              <div key={b.name} className="px-3 py-2.5 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="text-[11px] font-medium text-gray-700 font-mono">{b.name}</p>
                  <p className="text-[10px] text-gray-400">{b.date} · {b.size}</p>
                </div>
                <button onClick={() => toast(`Downloading ${b.name}`, "blue")}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                  <Download className="w-3.5 h-3.5"/>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

// ── API Keys modal ────────────────────────────────────────────────────────────
interface ApiKey {
  id: number;
  name: string;
  key: string;
  created: string;
  expires: string;
  status: string;
}

function ApiKeysModal({ onClose, toast }: { onClose: () => void; toast: (msg: string, type: ToastType) => void }): JSX.Element {
  const [keys, setKeys]       = useState(initialApiKeys);
  const [visible, setVisible] = useState<{ [key: number]: boolean }>({});
  const [adding, setAdding]   = useState(false);
  const [newName, setNewName] = useState("");

  const toggleVisible = (id: number): void => setVisible((p) => ({ ...p, [id]: !p[id] }));
  const revoke = (id: number): void => { setKeys((p) => p.filter((k) => k.id !== id)); toast("API key revoked", "red"); };
  const addKey = (): void => {
    if (!newName) return;
    const raw = "bms_live_" + Math.random().toString(36).slice(2, 18);
    setKeys((p) => [...p, { id:Date.now(), name:newName, key:raw, created:"May 24, 2026", expires:"May 24, 2027", status:"Active" }]);
    toast(`API key ${newName} created`, "green");
    setAdding(false); setNewName("");
  };

  return (
    <ModalShell title="API Keys" icon={Key} iconColor="text-amber-600" onClose={onClose} wide
      footer={<button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Close</button>}>
      <div className="space-y-3">
        <div className="flex justify-end">
          <button onClick={() => setAdding(true)} className="px-3 py-1.5 text-[12px] rounded-lg bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5"/> Generate Key
          </button>
        </div>
        {adding && (
          <div className="border border-amber-100 bg-amber-50 rounded-lg p-3 space-y-2">
            <p className="text-[11px] font-semibold text-amber-700">New API Key</p>
            <input className="w-full border border-gray-200 rounded px-2 py-1 text-[12px] focus:outline-none"
              placeholder="Key name (e.g. BMS-KEY-004)" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={addKey} className="px-3 py-1 text-[11px] rounded bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-1"><Check className="w-3 h-3"/>Generate</button>
              <button onClick={() => setAdding(false)} className="px-3 py-1 text-[11px] rounded border border-gray-200 text-gray-500 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        )}
        <div className="divide-y divide-gray-50 rounded-lg border border-gray-100 overflow-hidden">
          {keys.map((k: ApiKey) => (
            <div key={k.id} className="px-3 py-3 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-semibold text-gray-800">{k.name}</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${k.status === "Active" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{k.status}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono text-gray-500 truncate flex-1">{visible[k.id] ? k.key : k.key.replace(/(?<=.{12}).+/, "••••••••••")}</span>
                <button onClick={() => toggleVisible(k.id)} className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0">
                  {visible[k.id] ? <EyeOff className="w-3 h-3"/> : <Eye className="w-3 h-3"/>}
                </button>
                <button onClick={() => { navigator.clipboard?.writeText(k.key); toast("Key copied to clipboard", "blue"); }} className="p-1 text-gray-400 hover:text-blue-600 flex-shrink-0">
                  <Copy className="w-3 h-3"/>
                </button>
                <button onClick={() => revoke(k.id)} className="p-1 text-gray-400 hover:text-red-600 flex-shrink-0">
                  <Trash2 className="w-3 h-3"/>
                </button>
              </div>
              <p className="text-[10px] text-gray-400">Created {k.created} · Expires {k.expires}</p>
            </div>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}

// ── Sync / Refresh modal ──────────────────────────────────────────────────────
interface ActivityEntry {
  user: string;
  action: string;
  role: string;
  time: string;
}

function SyncModal({ setActivity, onClose, toast }: { setActivity: (fn: (prev: ActivityEntry[]) => ActivityEntry[]) => void; onClose: () => void; toast: (msg: string, type: ToastType) => void }): JSX.Element {
  const [step, setStep]     = useState(0);
  const steps = ["Checking database connection…","Syncing user sessions…","Refreshing role cache…","Rebuilding search index…","Done!"];

  const runSync = (): void => {
    setStep(1);
    const tick = (i: number): void => {
      if (i >= steps.length) return;
      setTimeout(() => { setStep(i); if (i < steps.length - 1) tick(i + 1); else {
        toast("System sync completed", "green");
        setActivity((prev: ActivityEntry[]) => [{ user:"System", action:"Full sync completed", role:"System Admin", time:"Just now" }, ...prev.slice(0,4)]);
      }}, 700 * (i - 1 || 1));
    };
    tick(1); setTimeout(() => tick(2), 700); setTimeout(() => tick(3), 1400); setTimeout(() => tick(4), 2100); setTimeout(() => { setStep(5); }, 2800);
  };

  return (
    <ModalShell title="Sync / Refresh" icon={RefreshCw} iconColor="text-blue-500" onClose={onClose}
      footer={<button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Close</button>}>
      <div className="space-y-4">
        <p className="text-[12px] text-gray-500">Run a full system sync to refresh cached data, user sessions, and search indexes.</p>
        {step === 0 && (
          <button onClick={runSync} className="w-full py-2.5 text-[12px] rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 flex items-center justify-center gap-2">
            <RefreshCw className="w-3.5 h-3.5"/> Start Sync
          </button>
        )}
        {step > 0 && (
          <div className="space-y-2">
            {steps.slice(1).map((s: string, i: number) => {
              const idx = i + 1;
              const done = step > idx;
              const active = step === idx;
              return (
                <div key={s} className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${done ? "border-green-100 bg-green-50" : active ? "border-blue-100 bg-blue-50" : "border-gray-100"}`}>
                  {done ? <Check className="w-4 h-4 text-green-500 flex-shrink-0"/> : active ? <RotateCcw className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0"/> : <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0"/>}
                  <span className={`text-[12px] ${done ? "text-green-700" : active ? "text-blue-700 font-medium" : "text-gray-400"}`}>{s}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ModalShell>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
type ModalType = "users" | "roles" | "settings" | "backup" | "keys" | "sync" | null;

export default function SystemAdminDashboard(): JSX.Element {
  const [users, setUsers]       = useState(initialUsers);
  const [alerts, setAlerts]     = useState(initialAlerts);
  const [activity, setActivity] = useState(initialActivity);
  const [modal, setModal]       = useState<ModalType>(null);
  const [toast, setToastState]  = useState({ visible:false, message:"", type:"green" as ToastType });

  const showToast = (message: string, type: ToastType = "green"): void => {
    setToastState({ visible:true, message, type });
    setTimeout(() => setToastState((t) => ({ ...t, visible:false })), 2800);
  };

  const dismissAlert = (id: number): void => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast("Alert dismissed", "blue");
  };

  const stats = [
    { label:"Total Users",       value: users.length,                                          sub:"across all roles",   icon:Users,       color:"blue"   },
    { label:"Active Sessions",   value: users.filter((u) => u.status === "Active").length,     sub:"currently online",   icon:Activity,    color:"green"  },
    { label:"System Alerts",     value: alerts.length,                                         sub:"require attention",  icon:AlertCircle, color:"red"    },
    { label:"Roles Configured",  value: ROLES.length,                                          sub:"roles in system",    icon:ShieldCheck, color:"purple" },
  ];

  const quickActions = [
    { label:"Manage Users",     icon:Users,      key:"users",    hover:"hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"   },
    { label:"Role Permissions", icon:ShieldCheck,key:"roles",    hover:"hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700" },
    { label:"System Settings",  icon:Settings,   key:"settings", hover:"hover:bg-gray-100 hover:border-gray-300"                      },
    { label:"Database Backup",  icon:Database,   key:"backup",   hover:"hover:bg-green-50 hover:border-green-200 hover:text-green-700" },
    { label:"API Keys",         icon:Key,        key:"keys",     hover:"hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700" },
    { label:"Sync / Refresh",   icon:RefreshCw,  key:"sync",     hover:"hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"   },
  ];

  return (
    <main className="p-4 sm:p-6 space-y-6">
      <div>
        <h2 className="text-[15px] font-semibold text-gray-900">System Overview</h2>
        <p className="text-[12px] text-gray-400 mt-0.5">Full control of the Budget Monitoring System · FY 2026</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s: any) => (
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

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a: any) => (
            <div key={a.id} className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${a.level === "red" ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"}`}>
              <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${a.level === "red" ? "text-red-500" : "text-amber-500"}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-[12px] font-semibold ${a.level === "red" ? "text-red-700" : "text-amber-700"}`}>{a.title}</p>
                <p className={`text-[11px] mt-0.5 ${a.level === "red" ? "text-red-600" : "text-amber-600"}`}>{a.desc}</p>
              </div>
              <button onClick={() => dismissAlert(a.id)} className="text-gray-400 hover:text-gray-600 flex-shrink-0 mt-0.5">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-gray-800">Recent Activity</span>
            <span className="text-[11px] text-blue-600 cursor-pointer hover:underline">View all</span>
          </div>
          <div className="divide-y divide-gray-50">
            {activity.map((a: ActivityEntry, i: number) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-bold text-blue-700">{initials(a.user)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-gray-800 truncate">{a.user}</p>
                    <p className="text-[11px] text-gray-400 truncate">{a.action}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] text-gray-400">{a.role}</p>
                  <p className="text-[10px] text-gray-300">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="text-[13px] font-semibold text-gray-800">Quick Actions</span>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {quickActions.map((a: any) => (
              <button key={a.label} onClick={() => setModal(a.key as ModalType)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-md border border-gray-100 transition-colors text-center text-gray-500 ${a.hover}`}>
                <a.icon className="w-4 h-4" />
                <span className="text-[11px] leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === "users"    && <ManageUsersModal    users={users} setUsers={setUsers} onClose={() => setModal(null)} toast={showToast} />}
      {modal === "roles"    && <RolePermissionsModal                                  onClose={() => setModal(null)} toast={showToast} />}
      {modal === "settings" && <SystemSettingsModal                                   onClose={() => setModal(null)} toast={showToast} />}
      {modal === "backup"   && <DatabaseBackupModal                                   onClose={() => setModal(null)} toast={showToast} />}
      {modal === "keys"     && <ApiKeysModal                                          onClose={() => setModal(null)} toast={showToast} />}
      {modal === "sync"     && <SyncModal           setActivity={setActivity}         onClose={() => setModal(null)} toast={showToast} />}

      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </main>
  );
}