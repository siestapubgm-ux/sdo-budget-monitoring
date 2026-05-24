"use client";

import { SidebarProvider } from "@/lib/sidebar-context";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* Government accent strip */}
      <div className="fixed top-0 inset-x-0 z-50 h-[3px] bg-gradient-to-r from-deped-blue via-deped-blue to-deped-gold" />

      <div className="flex min-h-screen pt-[3px]">
        <Sidebar />
        <div className="w-full md:ml-[220px] flex flex-col min-h-screen flex-1 min-w-0">
          <Header />
          <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
          <footer className="border-t border-gray-200 bg-white px-4 sm:px-6 py-2.5 text-center text-[11px] text-gray-400">
            © {new Date().getFullYear()} Schools Division Office of Cagayan · Department of Education Region II ·{" "}
            <span className="text-gray-500 font-medium">Budget Monitoring System v1.0</span>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
