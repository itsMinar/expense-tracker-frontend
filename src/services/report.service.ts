import api from '@/lib/api';
import { Report, ApiResponse } from '@/types';

export const reportService = {
  generate: async (params: { type: string; month?: number; year?: number }) => {
    const res = await api.get<ApiResponse<{ report: Report }>>('/reports', { params });
    return res.data.data.report;
  },
};
