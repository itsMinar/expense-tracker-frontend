import api from '@/lib/api';
import { DashboardStats, ApiResponse } from '@/types';

export const dashboardService = {
  stats: async () => {
    const res = await api.get<ApiResponse<DashboardStats>>('/dashboard');
    return res.data.data;
  },
};
