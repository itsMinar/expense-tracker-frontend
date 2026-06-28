'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { BreakdownChart } from '@/components/dashboard/pie-chart';
import { Card, CardSkeleton } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { PiggyBank, AlertTriangle } from 'lucide-react';
import { AnimatedContent, StaggerContainer, StaggerItem } from '@/components/common/animated-content';

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardService.stats,
  });

  return (
    <AnimatedContent className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Your financial overview
        </p>
      </div>

      <StatsCards data={data} isLoading={isLoading} />

      <div className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <OverviewChart
              expenses={data?.monthlyExpenses || []}
              incomes={data?.monthlyIncomes || []}
            />
            <div className="space-y-4">
              <BreakdownChart
                data={data?.expenseBreakdown || []}
                title="Expense Breakdown"
              />
            </div>
          </>
        )}
      </div>

      <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" delay={0.08}>
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StaggerItem>
              <Card className="p-6 group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Budget Left</p>
                  <PiggyBank className="h-4 w-4 text-emerald-500 transition-transform duration-200 group-hover:scale-110" />
                </div>
                <p className="text-2xl font-bold">{formatCurrency(data?.budgetLeft || 0)}</p>
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card className="p-6 group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Spending Rate</p>
                  <AlertTriangle className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${(data?.spendingRate || 0) > 80 ? 'text-red-500' : 'text-amber-500'}`} />
                </div>
                <p className="text-2xl font-bold">{data?.spendingRate || 0}%</p>
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card className="p-6 group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Monthly Savings</p>
                  <PiggyBank className="h-4 w-4 text-purple-500 transition-transform duration-200 group-hover:scale-110" />
                </div>
                <p className="text-2xl font-bold">{formatCurrency(data?.monthlySavings || 0)}</p>
              </Card>
            </StaggerItem>
          </>
        )}
      </StaggerContainer>
    </AnimatedContent>
  );
}
