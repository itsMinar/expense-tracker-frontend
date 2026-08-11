import api from '@/lib/api';
import { ApiResponse, Report, ReportType } from '@/types';

export const reportService = {
  generate: async (params: {
    type: ReportType;
    month?: number;
    year?: number;
  }) => {
    const res = await api.get<ApiResponse<{ report: Report }>>('/reports', {
      params,
    });
    return res.data.data.report;
  },
};
