'use client';

import { cacheKeys } from '@/lib/cache-keys';
import { tokenStore } from '@/lib/token';
import { authService } from '@/services/auth.service';
import { User } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPage = PUBLIC_PATHS.some((p) => pathname?.startsWith(p));

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<User | null>({
    queryKey: [cacheKeys.profile],
    queryFn: async () => {
      try {
        return await authService.getMe();
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: !isPublicPage,
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData([cacheKeys.profile], data.user);
      if (data.accessToken && data.refreshToken) {
        tokenStore.setTokens(data.accessToken, data.refreshToken);
      }
      toast.success('Login successful');
      router.push('/dashboard');
    },
    onError: (error: AxiosError) => {
      const msg =
        error.response?.data &&
        typeof error.response?.data === 'object' &&
        'message' in error.response?.data
          ? (error.response?.data as { message: string }).message
          : 'Login failed';
      toast.error(msg);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      queryClient.setQueryData([cacheKeys.profile], data.user);
      if (data.accessToken && data.refreshToken) {
        tokenStore.setTokens(data.accessToken, data.refreshToken);
      }
      toast.success('Account created successfully');
      router.push('/dashboard');
    },
    onError: (error: AxiosError) => {
      const msg =
        error.response?.data &&
        typeof error.response?.data === 'object' &&
        'message' in error.response?.data
          ? (error.response?.data as { message: string }).message
          : 'Registration failed';
      toast.error(msg);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      tokenStore.clearTokens();
      queryClient.setQueryData([cacheKeys.profile], null);
      queryClient.clear();
      toast.success('Logged out');
      router.push('/auth/login');
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData([cacheKeys.profile], updatedUser);
      toast.success('Profile updated');
    },
    onError: (error: AxiosError) => {
      const msg =
        error.response?.data &&
        typeof error.response?.data === 'object' &&
        'message' in error.response?.data
          ? (error.response?.data as { message: string }).message
          : 'Update failed';
      toast.error(msg);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: AxiosError) => {
      const msg =
        error.response?.data &&
        typeof error.response?.data === 'object' &&
        'message' in error.response?.data
          ? (error.response?.data as { message: string }).message
          : 'Password change failed';
      toast.error(msg);
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: authService.deleteAccount,
    onSuccess: () => {
      tokenStore.clearTokens();
      queryClient.setQueryData([cacheKeys.profile], null);
      queryClient.clear();
      toast.success('Account deleted');
      router.push('/auth/login');
    },
    onError: (error: AxiosError) => {
      const msg =
        error.response?.data &&
        typeof error.response?.data === 'object' &&
        'message' in error.response?.data
          ? (error.response?.data as { message: string }).message
          : 'Delete failed';
      toast.error(msg);
    },
  });

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user && !isError,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    deleteAccount: deleteAccountMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  };
}
