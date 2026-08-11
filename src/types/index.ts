export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
  currency: string;
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
  expenseBreakdown: {
    _id: string;
    total: number;
    count: number;
    category: Category;
  }[];
  incomeBreakdown: {
    _id: string;
    total: number;
    count: number;
    category: Category;
  }[];
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

export interface SelectOption {
  value: string;
  label: string;
}

export type PaymentMethod =
  'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'other';

export type ReportType = 'weekly' | 'monthly' | 'yearly';

export type CategoryType = 'expense' | 'income' | 'both';

export interface ExpenseFormData {
  title: string;
  amount: string;
  category: string;
  description: string;
  paymentMethod: PaymentMethod;
  date: string;
  notes: string;
  tags: string;
}

export interface IncomeFormData {
  title: string;
  amount: string;
  category: string;
  source: string;
  date: string;
  notes: string;
}

export interface CategoryFormData {
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
}

export interface BudgetFormData {
  category: string;
  amount: string;
  month: number;
  year: number;
}

export interface ProfileFormData {
  name: string;
  email: string;
  currency?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export type Transaction = Expense | Income;

export interface ExpenseCreateData {
  title: string;
  amount: number;
  category: string;
  description?: string;
  paymentMethod: PaymentMethod;
  date: string;
  notes?: string;
  tags: string[];
}

export interface IncomeCreateData {
  title: string;
  amount: number;
  category: string;
  source?: string;
  date: string;
  notes?: string;
}

export interface CategoryCreateData {
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
}

export interface BudgetCreateData {
  category: string;
  amount: number;
  month: number;
  year: number;
}
