"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, ChevronRight, Menu, LogOut, User, ChevronDown } from "lucide-react";
import { useSidebar } from "@/lib/sidebar-context";
import { supabase } from "@/lib/supabase/client";
import { useRef, useState, useEffect } from "react";

const pageMeta: Record<string, { title: string; sub: string }> = {
  // Budget Officer
  "/budget_officer/dashboard":              { title: "Dashboard",         sub: "Budget performance overview · FY 2026" },
  "/budget_officer/dashboard/budget":        { title: "Budget Allocation",  sub: "Programs, Activities & Projects (PAPs)" },
  "/budget_officer/dashboard/obligations":   { title: "Obligations",        sub: "ORS register and obligation tracking" },
  "/budget_officer/dashboard/disbursements": { title: "Disbursements",      sub: "Disbursement vouchers and actual payments" },
  "/budget_officer/dashboard/reports":       { title: "Reports & Analytics", sub: "Budget performance summaries and charts" },
  
  // System Admin
  "/system_admin/dashboard":                 { title: "Dashboard",         sub: "System administration overview" },
  "/system_admin/dashboard/users":           { title: "User Management",   sub: "Manage users and permissions" },
  
  // Program Owner
  "/program_owner/dashboard":                { title: "Dashboard",         sub: "Program overview and tracking" },
  "/program_owner/dashboard/programs":       { title: "Programs",          sub: "Your managed programs" },
  
  // PMT Validator
  "/pmt_validator/dashboard":                { title: "Dashboard",         sub: "Payment Monitoring Team validations" },
  "/pmt_validator/dashboard/validations":    { title: "Validations",       sub: "Pending and completed validations" },
  
  // PMIS Coordinator
  "/pmis_coordinator/dashboard":             { title: "Dashboard",         sub: "PMIS coordination overview" },
  "/pmis_coordinator/dashboard/projects":    { title: "Projects",          sub: "Project coordination" },
  
  // HRD Reviewer
  "/hrd_reviewer/dashboard":                 { title: "Dashboard",         sub: "Human Resources Development overview" },
  "/hrd_reviewer/dashboard/reviews":         { title: "Document Reviews",  sub: "HRD document reviews" },
  
  // SSME Reviewer
  "/ssme_reviewer/dashboard":                { title: "Dashboard",         sub: "Special Schools and Magnets overview" },
  "/ssme_reviewer/dashboard/reviews":        { title: "SSME Reviews",      sub: "SSME document reviews" },
  
  // SMME Reviewer (variant)
  "/smme_reviewer/dashboard":                { title: "Dashboard",         sub: "Special Schools and Magnets overview" },
  "/smme_reviewer/dashboard/reviews":        { title: "SSME Reviews",      sub: "SSME document reviews" },
  
  // Functional Chief
  "/functional_chief/dashboard":             { title: "Dashboard",         sub: "Functional chief overview" },
  "/functional_chief/dashboard/approvals":   { title: "Approvals",         sub: "Pending approvals" },
  
  // Accountant
  "/accountant/dashboard":                   { title: "Dashboard",         sub: "Accounting overview" },
  "/accountant/dashboard/transactions":      { title: "Transactions",      sub: "Financial transactions" },
  
  // ASDS
  "/asds/dashboard":                         { title: "Dashboard",         sub: "ASDS overview" },
  
  // SDS
  "/sds/dashboard":                          { title: "Dashboard",         sub: "SDS overview" },
  
  // Legacy support
  "/":              { title: "Dashboard",         sub: "Budget performance overview · FY 2026" },
  "/budget":        { title: "Budget Allocation",  sub: "Programs, Activities & Projects (PAPs)" },
  "/obligations":   { title: "Obligations",        sub: "ORS register and obligation tracking" },
  "/disbursements": { title: "Disbursements",      sub: "Disbursement vouchers and actual payments" },
  "/reports":       { title: "Reports & Analytics", sub: "Budget performance summaries and charts" },
};

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

export default function Header() {
  const pathname = usePathname();
  const meta = pageMeta[pathname] ?? { title: "Page", sub: "" };
  const { toggle } = useSidebar();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch user data on mount
  useEffect(() => {
    async function fetchUserData() {
      try {
        // Get current user session
        const { data: authData } = await supabase.auth.getSession();
        const user = authData?.session?.user;

        if (!user) {
          setLoading(false);
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
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    setDropdownOpen(false);
    // Sign out from Supabase first
    supabase.auth.signOut().then(() => {
      // Then redirect to login
      window.location.href = "/login";
    });
  }

  return (
    <header className="h-14 md:h-[56px] bg-white border-b border-gray-200 flex items-center px-3 sm:px-6 gap-3 sm:gap-4 flex-shrink-0">
      {/* Mobile menu toggle */}
      <button
        onClick={toggle}
        className="md:hidden flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumb + page title */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="text-[11px] text-gray-400 font-medium hidden sm:inline">BMS</span>
        <ChevronRight className="w-3 h-3 text-gray-300 hidden sm:inline flex-shrink-0" />
        <h1 className="text-sm sm:text-[14px] font-semibold text-gray-900 truncate">{meta.title}</h1>
        <span className="hidden lg:inline-flex items-center gap-1.5 ml-2 flex-shrink-0">
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-[11px] text-gray-400 truncate">{meta.sub}</span>
        </span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <div className="hidden md:flex items-center gap-1.5 h-8 bg-gray-50 border border-gray-200 rounded-md px-2.5 w-44 hover:border-gray-300 transition-colors">
          <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Quick search…"
            className="bg-transparent text-[12px] text-gray-700 placeholder-gray-400 focus:outline-none w-full"
          />
        </div>

        <div className="hidden sm:flex items-center h-7 px-2 bg-blue-50 border border-blue-100 rounded text-[10px] sm:text-[11px] font-semibold text-blue-700 select-none flex-shrink-0">
          FY 2026
        </div>

        <button className="relative w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors flex-shrink-0">
          <Bell className="w-4 h-4" />
          <span className="absolute top-[7px] right-[7px] w-1.5 h-1.5 bg-red-500 rounded-full ring-1 ring-white" />
        </button>

        <div className="w-px h-4 bg-gray-200 mx-1 hidden sm:block" />

        {/* Profile dropdown */}
        <div className="relative hidden sm:block" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-gray-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[12px] font-semibold text-gray-800 leading-none">{userName}</p>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5">
                {roleDisplayMap[userRole] || userRole}
              </p>
              <p className="text-[9px] text-gray-400 leading-none mt-0.5">{userEmail}</p>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-gray-400 hidden md:block transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
              {/* Profile info header */}
              <div className="px-3 py-2.5 border-b border-gray-100">
                <p className="text-[12px] font-semibold text-gray-800 leading-none">{userName}</p>
                <p className="text-[11px] text-gray-400 leading-none mt-1">
                  {roleDisplayMap[userRole] || userRole}
                </p>
                <p className="text-[10px] text-gray-400 leading-none mt-0.5">{userEmail}</p>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  My Profile
                </button>

                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}