import api from '@/lib/api';
import { Income, Pagination, ApiResponse } from '@/types';

interface IncomeListResponse {
  incomes: Income[];
  pagination: Pagination;
}

export const incomeService = {
  list: async (params?: Record<string, string | number | undefined>) => {
    const res = await api.get<ApiResponse<IncomeListResponse>>('/income', { params });
    return res.data.data;
  },

  getById: async (id: string) => {
    const res = await api.get<ApiResponse<{ income: Income }>>(`/income/${id}`);
    return res.data.data.income;
  },

  create: async (data: Partial<Income>) => {
    const res = await api.post<ApiResponse<{ income: Income }>>('/income', data);
    return res.data.data.income;
  },

  update: async (id: string, data: Partial<Income>) => {
    const res = await api.patch<ApiResponse<{ income: Income }>>(`/income/${id}`, data);
    return res.data.data.income;
  },

  delete: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/income/${id}`);
    return res.data;
  },
};
