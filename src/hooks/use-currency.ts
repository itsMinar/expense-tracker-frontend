'use client';

import { cacheKeys } from '@/lib/cache-keys';
import { formatCurrency as formatCurrencyUtil } from '@/lib/utils';
import { authService } from '@/services/auth.service';
import { User } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useCurrency() {
  const { data: user } = useQuery<User | null>({
    queryKey: [cacheKeys.profile],
    queryFn: async () => {
      try {
        return await authService.getMe();
      } catch {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const currency = user?.currency || 'USD';

  const format = (amount: number) => formatCurrencyUtil(amount, currency);

  return {
    currency,
    format,
    formatCurrency: (amount: number, overrideCurrency?: string) =>
      formatCurrencyUtil(amount, overrideCurrency || currency),
  };
}
