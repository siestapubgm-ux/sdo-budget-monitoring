import { transactions } from "@/lib/data";
import { formatPeso } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function TxTypePill({ type }: { type: string }) {
  const styles: Record<string, string> = {
    Allotment:    "bg-blue-50 text-blue-700",
    Obligation:   "bg-amber-50 text-amber-700",
    Disbursement: "bg-emerald-50 text-emerald-700",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${styles[type] ?? "bg-gray-100 text-gray-600"}`}>
      {type}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Approved:  "bg-emerald-500",
    Pending:   "bg-amber-400",
    Cancelled: "bg-gray-300",
  };
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${colors[status] ?? "bg-gray-300"}`} />
      <span className="text-[11px] text-gray-600">{status}</span>
    </div>
  );
}

function ClassBadge({ cls }: { cls: string }) {
  const styles: Record<string, string> = {
    PS:   "text-blue-700 bg-blue-50",
    MOOE: "text-indigo-700 bg-indigo-50",
    CO:   "text-purple-700 bg-purple-50",
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${styles[cls] ?? "bg-gray-100 text-gray-600"}`}>
      {cls}
    </span>
  );
}

export default function RecentTransactions() {
  const recent = transactions.slice(0, 7);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
            Recent Activity
          </p>
          <p className="text-[14px] font-semibold text-gray-800 mt-0.5">
            Latest Transactions
          </p>
        </div>
        <Link
          href="/obligations"
          className="flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <table className="w-full text-[12px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left py-2.5 px-5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Reference
            </th>
            <th className="text-left py-2.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Type
            </th>
            <th className="text-left py-2.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 hidden md:table-cell">
              Description
            </th>
            <th className="text-center py-2.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Class
            </th>
            <th className="text-right py-2.5 px-5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Amount
            </th>
            <th className="text-left py-2.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 hidden lg:table-cell">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {recent.map((tx) => (
            <tr key={tx.id} className="transition-colors">
              <td className="py-3 px-5">
                <p className="font-mono text-[11px] font-semibold text-gray-700">{tx.reference}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{tx.date}</p>
              </td>
              <td className="py-3 px-3">
                <TxTypePill type={tx.type} />
              </td>
              <td className="py-3 px-3 hidden md:table-cell max-w-[200px]">
                <p className="text-gray-700 truncate">{tx.description}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">{tx.payee}</p>
              </td>
              <td className="py-3 px-3 text-center">
                <ClassBadge cls={tx.expenseClass} />
              </td>
              <td className="py-3 px-5 text-right">
                <span className="font-mono font-semibold text-gray-900 num">{formatPeso(tx.amount)}</span>
              </td>
              <td className="py-3 px-3 hidden lg:table-cell">
                <StatusDot status={tx.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
