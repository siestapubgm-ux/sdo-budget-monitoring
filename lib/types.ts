export type ExpenseClass = "PS" | "MOOE" | "CO";
export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";
export type TransactionType = "Allotment" | "Obligation" | "Disbursement";
export type BudgetStatus = "On Track" | "At Risk" | "Delayed" | "Completed";
export type TxStatus = "Approved" | "Pending" | "Cancelled";
export type FundCluster = "01" | "02" | "06";

export interface BudgetAllocation {
  id: string;
  code: string;
  program: string;
  activity: string;
  expenseClass: ExpenseClass;
  fundCluster: FundCluster;
  appropriation: number;
  allotment: number;
  obligation: number;
  disbursement: number;
  quarter: Quarter;
  status: BudgetStatus;
  responsible: string;
}

export interface Transaction {
  id: string;
  date: string;
  reference: string;
  payee: string;
  description: string;
  amount: number;
  type: TransactionType;
  status: TxStatus;
  expenseClass: ExpenseClass;
  program: string;
}

export interface MonthlyTrend {
  month: string;
  allotment: number;
  obligation: number;
  disbursement: number;
}

export interface ProgramSummary {
  program: string;
  short: string;
  appropriation: number;
  allotment: number;
  obligation: number;
  disbursement: number;
}

export interface ExpenseSummary {
  name: string;
  value: number;
  color: string;
}
