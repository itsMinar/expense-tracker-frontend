import api from '@/lib/api';
import { Budget, ApiResponse } from '@/types';

export const budgetService = {
  list: async (params?: Record<string, string | number | undefined>) => {
    const res = await api.get<ApiResponse<{ budgets: Budget[] }>>('/budgets', { params });
    return res.data.data.budgets;
  },

  getById: async (id: string) => {
    const res = await api.get<ApiResponse<{ budget: Budget }>>(`/budgets/${id}`);
    return res.data.data.budget;
  },

  create: async (data: Partial<Budget>) => {
    const res = await api.post<ApiResponse<{ budget: Budget }>>('/budgets', data);
    return res.data.data.budget;
  },

  update: async (id: string, data: Partial<Budget>) => {
    const res = await api.patch<ApiResponse<{ budget: Budget }>>(`/budgets/${id}`, data);
    return res.data.data.budget;
  },

  delete: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/budgets/${id}`);
    return res.data;
  },
};
