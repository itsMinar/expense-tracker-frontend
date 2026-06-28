'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/services/report.service';
import { Button, Card, Select, CardSkeleton } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function AnalyticsPage() {
  const now = new Date();
  const [type, setType] = useState('monthly');
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data: report, isLoading } = useQuery({
    queryKey: ['reports', { type, month, year }],
    queryFn: () => reportService.generate({ type, month, year }),
  });

  const expenseData = report?.expenseByCategory ? Object.entries(report.expenseByCategory).map(([name, value]) => ({ name, value })) : [];
  const incomeData = report?.incomeByCategory ? Object.entries(report.incomeByCategory).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics & Reports</h1>
        <p className="text-sm text-muted-foreground">View detailed reports and insights</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-3">
          <Select id="report-type" options={[{ value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]} value={type} onChange={(e) => setType(e.target.value)} />
          {type !== 'yearly' && (
            <Select id="report-month" options={Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString(), label: new Date(2000, i).toLocaleString('default', { month: 'long' }) }))} value={month.toString()} onChange={(e) => setMonth(parseInt(e.target.value))} />
          )}
          <Select id="report-year" options={Array.from({ length: 5 }, (_, i) => ({ value: (now.getFullYear() - 2 + i).toString(), label: (now.getFullYear() - 2 + i).toString() }))} value={year.toString()} onChange={(e) => setYear(parseInt(e.target.value))} />
        </div>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : report && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-2xl font-bold text-emerald-500">{formatCurrency(report.summary.totalIncome)}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Total Expense</p>
              <p className="text-2xl font-bold text-red-500">{formatCurrency(report.summary.totalExpense)}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Net Savings</p>
              <p className={`text-2xl font-bold ${report.summary.netSavings >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{formatCurrency(report.summary.netSavings)}</p>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Expense by Category</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                      {expenseData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Income by Category</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={incomeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                      {incomeData.map((_, idx) => <Cell key={idx} fill={COLORS[(idx + 2) % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Income vs Expense</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: 'Income', amount: report.summary.totalIncome }, { name: 'Expense', amount: report.summary.totalExpense }]}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    <Cell fill="hsl(var(--chart-2))" />
                    <Cell fill="hsl(var(--chart-1))" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Transactions ({report.summary.transactionCount})</h3>
            <div className="divide-y">
              {[...report.expenses.slice(0, 10), ...report.incomes.slice(0, 10)]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((t: any) => (
                  <div key={t._id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">{t.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(t.date)} - {t.category?.name}</p>
                    </div>
                    <p className={`text-sm font-medium ${'source' in t ? 'text-emerald-500' : 'text-red-500'}`}>
                      {'source' in t ? '+' : '-'}{formatCurrency(t.amount)}
                    </p>
                  </div>
                ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
