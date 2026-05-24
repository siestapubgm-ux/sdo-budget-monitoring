export function formatPeso(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCompact(amount: number): string {
  if (amount >= 1_000_000_000) return `₱${(amount / 1_000_000_000).toFixed(2)}B`;
  if (amount >= 1_000_000) return `₱${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `₱${(amount / 1_000).toFixed(1)}K`;
  return `₱${amount.toFixed(2)}`;
}

export function pct(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 1000) / 10;
}

export function statusColor(status: string): string {
  switch (status) {
    case "On Track":  return "text-emerald-700 bg-emerald-50 border border-emerald-200";
    case "At Risk":   return "text-amber-700 bg-amber-50 border border-amber-200";
    case "Delayed":   return "text-red-700 bg-red-50 border border-red-200";
    case "Completed": return "text-blue-700 bg-blue-50 border border-blue-200";
    case "Approved":  return "text-emerald-700 bg-emerald-50 border border-emerald-200";
    case "Pending":   return "text-amber-700 bg-amber-50 border border-amber-200";
    case "Cancelled": return "text-red-700 bg-red-50 border border-red-200";
    default:          return "text-gray-700 bg-gray-50 border border-gray-200";
  }
}

export function txTypeColor(type: string): string {
  switch (type) {
    case "Allotment":    return "text-blue-700 bg-blue-50";
    case "Obligation":   return "text-violet-700 bg-violet-50";
    case "Disbursement": return "text-emerald-700 bg-emerald-50";
    default:             return "text-gray-700 bg-gray-50";
  }
}

export function expenseClassBadge(cls: string): string {
  switch (cls) {
    case "PS":   return "bg-blue-100 text-blue-800";
    case "MOOE": return "bg-indigo-100 text-indigo-800";
    case "CO":   return "bg-purple-100 text-purple-800";
    default:     return "bg-gray-100 text-gray-800";
  }
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
