import api from '@/lib/api';
import { ApiResponse, DashboardStats } from '@/types';

export const dashboardService = {
  stats: async () => {
    const res = await api.get<ApiResponse<DashboardStats>>('/dashboard');
    return res.data.data;
  },
};
