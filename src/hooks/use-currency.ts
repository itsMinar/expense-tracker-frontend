'use client';

import { formatCurrency as formatCurrencyUtil } from '@/lib/utils';
import { User } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useCurrency() {
  const { data: user } = useQuery<User | null>({
    queryKey: ['auth', 'me'],
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
