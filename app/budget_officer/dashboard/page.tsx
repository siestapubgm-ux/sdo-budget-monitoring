import StatsCards from "@/components/dashboard/StatsCards";
import BudgetTrendChart from "@/components/dashboard/BudgetTrendChart";
import ExpenseClassChart from "@/components/dashboard/ExpenseClassChart";
import BudgetFlowBar from "@/components/dashboard/BudgetFlowBar";
import UtilizationByProgram from "@/components/dashboard/UtilizationByProgram";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { totals } from "@/lib/data";
import { pct, formatCompact } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

export default function DashboardPage() {
  const utilRate = pct(totals.obligation, totals.allotment);
  const balance = totals.allotment - totals.obligation;

  return (
    <div className="space-y-4 sm:space-y-5 max-w-[1500px]">

      {/* Alert strip */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2">
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 sm:px-3.5 py-2 text-[10px] sm:text-[11px]">
          <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 flex-shrink-0" />
          <span className="text-amber-700 font-medium">3 programs below 70% utilization target</span>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 sm:px-3.5 py-2 text-[10px] sm:text-[11px]">
          <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 flex-shrink-0" />
          <span className="text-emerald-700 font-medium">PS allotments fully released</span>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 sm:px-3.5 py-2 text-[10px] sm:text-[11px]">
          <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 flex-shrink-0" />
          <span className="text-blue-700 font-medium">
            Unobligated balance: <span className="font-bold num">{formatCompact(balance)}</span>
          </span>
        </div>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Budget flow chain */}
      <BudgetFlowBar />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="lg:col-span-2">
          <BudgetTrendChart />
        </div>
        <ExpenseClassChart />
      </div>

      {/* Utilization + Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <UtilizationByProgram />
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}
