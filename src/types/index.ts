export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  user: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income' | 'both';
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  description: string;
  category: Category;
  date: string;
  paymentMethod: string;
  notes: string;
  tags: string[];
  recurring: boolean;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface Income {
  _id: string;
  title: string;
  amount: number;
  category: Category;
  source: string;
  date: string;
  notes: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  _id: string;
  category: Category;
  amount: number;
  month: number;
  year: number;
  user: string;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  monthlySavings: number;
  monthlyIncome: number;
  monthlyExpense: number;
  budgetLeft: number;
  spendingRate: number;
  totalBudget: number;
  expenseBreakdown: { _id: string; total: number; count: number; category: Category }[];
  incomeBreakdown: { _id: string; total: number; count: number; category: Category }[];
  weeklySpending: { _id: number; total: number; count: number }[];
  monthlyExpenses: { month: number; total: number; count: number }[];
  monthlyIncomes: { month: number; total: number; count: number }[];
}

export interface Report {
  type: string;
  period: { startDate: string; endDate: string };
  summary: {
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
    transactionCount: number;
  };
  expenses: Expense[];
  incomes: Income[];
  expenseByCategory: Record<string, number>;
  incomeByCategory: Record<string, number>;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}
