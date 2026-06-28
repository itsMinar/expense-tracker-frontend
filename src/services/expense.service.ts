import api from '@/lib/api';
import { Expense, Pagination, ApiResponse } from '@/types';

interface ExpenseListResponse {
  expenses: Expense[];
  pagination: Pagination;
}

export const expenseService = {
  list: async (params?: Record<string, string | number | undefined>) => {
    const res = await api.get<ApiResponse<ExpenseListResponse>>('/expenses', { params });
    return res.data.data;
  },

  getById: async (id: string) => {
    const res = await api.get<ApiResponse<{ expense: Expense }>>(`/expenses/${id}`);
    return res.data.data.expense;
  },

  create: async (data: Partial<Expense>) => {
    const res = await api.post<ApiResponse<{ expense: Expense }>>('/expenses', data);
    return res.data.data.expense;
  },

  update: async (id: string, data: Partial<Expense>) => {
    const res = await api.patch<ApiResponse<{ expense: Expense }>>(`/expenses/${id}`, data);
    return res.data.data.expense;
  },

  delete: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/expenses/${id}`);
    return res.data;
  },
};
