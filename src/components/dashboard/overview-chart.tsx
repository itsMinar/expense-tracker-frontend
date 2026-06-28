'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card } from '@/components/ui';
import { getMonthName, formatCurrency } from '@/lib/utils';

interface MonthlyData {
  month: number;
  total: number;
}

interface OverviewChartProps {
  expenses: MonthlyData[];
  incomes: MonthlyData[];
}

export function OverviewChart({ expenses, incomes }: OverviewChartProps) {
  const data = expenses.map((e, i) => ({
    name: getMonthName(e.month),
    Expense: e.total,
    Income: incomes[i]?.total || 0,
  }));

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Overview</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs text-muted-foreground" />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              className="text-xs text-muted-foreground"
            />
            <Tooltip
              formatter={(value: any) => formatCurrency(Number(value))}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="Expense" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Income" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
