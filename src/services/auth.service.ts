import api from '@/lib/api';
import { User, ApiResponse } from '@/types';

export interface AuthResponse {
  user: User;
  accessToken?: string;
  refreshToken?: string;
}

export const authService = {
  register: async (data: { name: string; email: string; password: string }) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data.data;
  },

  logout: async () => {
    const res = await api.post<ApiResponse<null>>('/auth/logout');
    return res.data;
  },

  refresh: async () => {
    const res = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');
    return res.data.data;
  },

  getMe: async () => {
    const res = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return res.data.data.user;
  },

  updateProfile: async (data: Partial<User>) => {
    const res = await api.patch<ApiResponse<{ user: User }>>('/auth/profile', data);
    return res.data.data.user;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const res = await api.patch<ApiResponse<null>>('/auth/change-password', data);
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await api.post<ApiResponse<{ email: string }>>('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (data: { token: string; password: string }) => {
    const res = await api.post<ApiResponse<null>>('/auth/reset-password', data);
    return res.data;
  },

  deleteAccount: async () => {
    const res = await api.delete<ApiResponse<null>>('/auth/delete-account');
    return res.data;
  },
};
