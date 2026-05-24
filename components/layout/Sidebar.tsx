"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  ClipboardList,
  CreditCard,
  BarChart3,
  Settings,
  BookMarked,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fiscalYear } from "@/lib/data";
import { useSidebar } from "@/lib/sidebar-context";
import { supabase } from "@/lib/supabase/client";

const navItems = [
  { href: "/budget_officer/dashboard",              icon: LayoutDashboard, label: "Dashboard"         },
  { href: "/budget_officer/dashboard/budget",        icon: Wallet,          label: "Budget Allocation" },
  { href: "/budget_officer/dashboard/obligations",   icon: ClipboardList,   label: "Obligations"       },
  { href: "/budget_officer/dashboard/disbursements", icon: CreditCard,      label: "Disbursements"     },
  { href: "/budget_officer/dashboard/reports",       icon: BarChart3,       label: "Reports"           },
];

// Role-specific navigation
const navItemsByRole: Record<string, typeof navItems> = {
  budget_officer: [
    { href: "/budget_officer/dashboard",              icon: LayoutDashboard, label: "Dashboard"         },
    { href: "/budget_officer/dashboard/budget",        icon: Wallet,          label: "Budget Allocation" },
    { href: "/budget_officer/dashboard/obligations",   icon: ClipboardList,   label: "Obligations"       },
    { href: "/budget_officer/dashboard/disbursements", icon: CreditCard,      label: "Disbursements"     },
    { href: "/budget_officer/dashboard/reports",       icon: BarChart3,       label: "Reports"           },
  ],
  system_admin: [
    { href: "/system_admin/dashboard",                icon: LayoutDashboard, label: "Dashboard" },
  ],
  program_owner: [
    { href: "/program_owner/dashboard",               icon: LayoutDashboard, label: "Dashboard" },
  ],
  pmt_validator: [
    { href: "/pmt_validator/dashboard",               icon: LayoutDashboard, label: "Dashboard" },
  ],
  pmis_coordinator: [
    { href: "/pmis_coordinator/dashboard",            icon: LayoutDashboard, label: "Dashboard" },
  ],
  hrd_reviewer: [
    { href: "/hrd_reviewer/dashboard",                icon: LayoutDashboard, label: "Dashboard" },
  ],
  ssme_reviewer: [
    { href: "/ssme_reviewer/dashboard",               icon: LayoutDashboard, label: "Dashboard" },
  ],
  smme_reviewer: [
    { href: "/smme_reviewer/dashboard",               icon: LayoutDashboard, label: "Dashboard" },
  ],
  functional_chief: [
    { href: "/functional_chief/dashboard",            icon: LayoutDashboard, label: "Dashboard" },
  ],
  accountant: [
    { href: "/accountant/dashboard",                  icon: LayoutDashboard, label: "Dashboard" },
  ],
  asds: [
    { href: "/asds/dashboard",                        icon: LayoutDashboard, label: "Dashboard" },
  ],
  sds: [
    { href: "/sds/dashboard",                         icon: LayoutDashboard, label: "Dashboard" },
  ],
};

const defaultNavItems = [
  { href: "#",                                      icon: LayoutDashboard, label: "Dashboard" },
];

const roleDisplayMap: Record<string, string> = {
  admin:            "System Administrator",
  budget_officer:   "Budget Officer",
  system_admin:     "System Administrator",
  program_owner:    "Program Owner",
  pmt_validator:    "PMT Validator",
  pmis_coordinator: "PMIS Coordinator",
  hrd_reviewer:     "HRD Reviewer",
  ssme_reviewer:    "SSME Reviewer",
  smme_reviewer:    "SSME Reviewer",
  functional_chief: "Functional Chief",
  accountant:       "Accountant",
  asds:             "ASDS",
  sds:              "SDS",
};

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();
  const [userEmail, setUserEmail] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  // Fetch user data on mount
  useEffect(() => {
    async function fetchUserData() {
      try {
        // Get current user session
        const { data: authData } = await supabase.auth.getSession();
        const user = authData?.session?.user;

        if (!user) {
          return;
        }

        setUserEmail(user.email || "");

        // Extract name from email (part before @)
        const emailParts = user.email?.split("@") || [];
        const nameParts = emailParts[0]?.split(".") || [];
        const displayName = nameParts
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ");
        setUserName(displayName || "User");

        // Fetch user profile with role
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (!error && profiles?.role) {
          setUserRole(profiles.role);
        } else {
          // Try to detect role from current pathname as fallback
          const pathSegments = pathname.split("/").filter(Boolean);
          const possibleRole = pathSegments[0];
          
          // List of valid roles
          const validRoles = [
            "budget_officer", "system_admin", "program_owner", "pmt_validator",
            "pmis_coordinator", "hrd_reviewer", "ssme_reviewer", "smme_reviewer",
            "functional_chief", "accountant", "asds", "sds"
          ];
          
          if (validRoles.includes(possibleRole)) {
            setUserRole(possibleRole);
          } else {
            setUserRole(""); // No role found
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Try to detect role from current pathname as fallback
        const pathSegments = pathname.split("/").filter(Boolean);
        const possibleRole = pathSegments[0];
        
        const validRoles = [
          "budget_officer", "system_admin", "program_owner", "pmt_validator",
          "pmis_coordinator", "hrd_reviewer", "ssme_reviewer", "smme_reviewer",
          "functional_chief", "accountant", "asds", "sds"
        ];
        
        if (validRoles.includes(possibleRole)) {
          setUserRole(possibleRole);
        }
      }
    }

    fetchUserData();
  }, [pathname]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={close} />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-[220px] flex flex-col bg-sidebar border-r border-sidebar-border pt-[3px]",
          "transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        {/* App identity */}
        <div className="h-14 flex items-center gap-3 px-4 border-b border-sidebar-border">
          <div className="w-7 h-7 rounded-md bg-brand flex items-center justify-center flex-shrink-0">
            <BookMarked className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-black text-[13px] font-semibold leading-tight truncate">DepEd BMS</p>
            <p className="text-gray-600 text-[10px] leading-tight truncate">Budget Monitoring</p>
          </div>
          <button
            onClick={close}
            className="md:hidden flex-shrink-0 text-gray-500 hover:text-black"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Division context */}
        <div className="px-4 py-3 border-b border-sidebar-border">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-500 mb-1.5">
            Division
          </p>
          <p className="text-black text-[12px] font-medium truncate">SDO Cagayan</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-gray-700">Region II</span>
            <span className="w-1 h-1 rounded-full bg-gray-400" />
            <span className="text-[10px] text-brand font-semibold">FY {fiscalYear}</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-px">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-500 px-2 mb-2">
            Navigation
          </p>
          {(() => {
            const items = navItemsByRole[userRole] || defaultNavItems;
            return items.map(({ href, icon: Icon, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[12.5px] font-medium transition-all duration-100",
                    active
                      ? "bg-sidebar-active text-white"
                      : "text-gray-700 hover:text-black hover:bg-sidebar-hover"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-[15px] h-[15px] flex-shrink-0",
                      active ? "text-brand" : "text-gray-600"
                    )}
                  />
                  <span className="flex-1 truncate">{label}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                  )}
                </Link>
              );
            });
          })()}
        </nav>

        {/* User + Settings */}
        <div className="px-3 py-3 border-t border-sidebar-border space-y-px">
          <Link
            href="/settings"
            className="flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-gray-700 hover:text-black hover:bg-sidebar-hover transition-all text-[12px]"
          >
            <Settings className="w-[14px] h-[14px]" />
            Settings
          </Link>
          <div className="flex items-center gap-2.5 px-2.5 py-2 mt-1">
            <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-700 text-[10px] truncate">
                {roleDisplayMap[userRole] || userRole}
              </p>
              <p className="text-gray-600 text-[9px] truncate">{userEmail}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
