import { totals } from "@/lib/data";
import { pct, formatCompact } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function BudgetFlowBar() {
  const utilRate = pct(totals.obligation, totals.allotment);
  const balance = totals.allotment - totals.obligation;

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-gray-900">Budget Flow</div>
      
      <div className="space-y-2">
        {/* Allotment */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-600">Allotment</span>
            <span className="text-sm font-bold text-gray-900 num">{formatCompact(totals.allotment)}</span>
          </div>
          <div className="h-2 bg-blue-600 rounded-full"></div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center py-1">
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </div>

        {/* Obligation */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-600">Obligation ({utilRate}%)</span>
            <span className="text-sm font-bold text-gray-900 num">{formatCompact(totals.obligation)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full"
              style={{ width: `${utilRate}%` }}
            ></div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center py-1">
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </div>

        {/* Balance */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-600">Unobligated Balance</span>
            <span className="text-sm font-bold text-gray-900 num">{formatCompact(balance)}</span>
          </div>
          <div className="h-2 bg-orange-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
