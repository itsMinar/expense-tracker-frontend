import api from '@/lib/api';
import { Category, ApiResponse } from '@/types';

export const categoryService = {
  list: async (type?: string) => {
    const params = type ? { type } : undefined;
    const res = await api.get<ApiResponse<{ categories: Category[] }>>('/categories', { params });
    return res.data.data.categories;
  },

  getById: async (id: string) => {
    const res = await api.get<ApiResponse<{ category: Category }>>(`/categories/${id}`);
    return res.data.data.category;
  },

  create: async (data: Partial<Category>) => {
    const res = await api.post<ApiResponse<{ category: Category }>>('/categories', data);
    return res.data.data.category;
  },

  update: async (id: string, data: Partial<Category>) => {
    const res = await api.patch<ApiResponse<{ category: Category }>>(`/categories/${id}`, data);
    return res.data.data.category;
  },

  delete: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/categories/${id}`);
    return res.data;
  },
};
