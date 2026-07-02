'use client';

import {
  StaggerContainer,
  StaggerItem,
} from '@/components/common/animated-content';
import { Card, CardSkeleton } from '@/components/ui';
import { useCurrency } from '@/hooks/use-currency';
import { DashboardStats } from '@/types';
import { PiggyBank, TrendingDown, TrendingUp, Wallet } from 'lucide-react';

interface StatsCardsProps {
  data?: DashboardStats;
  isLoading: boolean;
}

const cards = [
  {
    key: 'totalBalance',
    label: 'Total Balance',
    icon: Wallet,
    color: 'text-blue-500',
  },
  {
    key: 'totalIncome',
    label: 'Total Income',
    icon: TrendingUp,
    color: 'text-emerald-500',
  },
  {
    key: 'totalExpense',
    label: 'Total Expense',
    icon: TrendingDown,
    color: 'text-red-500',
  },
  {
    key: 'monthlySavings',
    label: 'Monthly Savings',
    icon: PiggyBank,
    color: 'text-purple-500',
  },
] as const;

export function StatsCards({ data, isLoading }: StatsCardsProps) {
  const { formatCurrency: format } = useCurrency();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const value = (data?.[card.key as keyof DashboardStats] as number) ?? 0;
        return (
          <StaggerItem key={card.key}>
            <Card className="p-6 group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <card.icon
                  className={`h-4 w-4 ${card.color} transition-transform duration-200 group-hover:scale-110`}
                />
              </div>
              <p className="mt-2 text-2xl font-bold">{format(value)}</p>
            </Card>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}
