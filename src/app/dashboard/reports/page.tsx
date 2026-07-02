'use client';

import { Button, Card, Select } from '@/components/ui';
import { useCurrency } from '@/hooks/use-currency';
import { formatDate } from '@/lib/utils';
import { reportService } from '@/services/report.service';
import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ReportsPage() {
  const now = new Date();
  const { formatCurrency: fc } = useCurrency();
  const [type, setType] = useState('monthly');
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data: report, isLoading } = useQuery({
    queryKey: ['reports', { type, month, year }],
    queryFn: () => reportService.generate({ type, month, year }),
  });

  const exportCSV = () => {
    if (!report) return;
    const rows = [['Type', 'Title', 'Amount', 'Category', 'Date'].join(',')];
    report.expenses.forEach((e) =>
      rows.push(
        ['Expense', e.title, e.amount, e.category?.name, e.date].join(',')
      )
    );
    report.incomes.forEach((i) =>
      rows.push(
        ['Income', i.title, i.amount, i.category?.name, i.date].join(',')
      )
    );
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `report-${type}-${month}-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Generate and export reports
          </p>
        </div>
        <Button variant="outline" onClick={exportCSV} disabled={!report}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-3">
          <Select
            id="r-type"
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          {type !== 'yearly' && (
            <Select
              id="r-month"
              options={Array.from({ length: 12 }, (_, i) => ({
                value: (i + 1).toString(),
                label: new Date(2000, i).toLocaleString('default', {
                  month: 'long',
                }),
              }))}
              value={month.toString()}
              onChange={(e) => setMonth(parseInt(e.target.value))}
            />
          )}
          <Select
            id="r-year"
            options={Array.from({ length: 5 }, (_, i) => ({
              value: (now.getFullYear() - 2 + i).toString(),
              label: (now.getFullYear() - 2 + i).toString(),
            }))}
            value={year.toString()}
            onChange={(e) => setYear(parseInt(e.target.value))}
          />
        </div>
      </Card>

      {report && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-xl font-bold text-emerald-500">
                {fc(report.summary.totalIncome)}
              </p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Expense</p>
              <p className="text-xl font-bold text-red-500">
                {fc(report.summary.totalExpense)}
              </p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Net Savings</p>
              <p className="text-xl font-bold">
                {fc(report.summary.netSavings)}
              </p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-xl font-bold">
                {report.summary.transactionCount}
              </p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Expenses</h3>
            {report.expenses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No expenses in this period
              </p>
            ) : (
              <div className="divide-y">
                {report.expenses.map((e) => (
                  <div
                    key={e._id}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="font-medium">{e.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(e.date)} - {e.category?.name}
                      </p>
                    </div>
                    <p className="font-medium text-red-500">{fc(e.amount)}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Income</h3>
            {report.incomes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No income in this period
              </p>
            ) : (
              <div className="divide-y">
                {report.incomes.map((i) => (
                  <div
                    key={i._id}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="font-medium">{i.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(i.date)} - {i.category?.name}
                      </p>
                    </div>
                    <p className="font-medium text-emerald-500">
                      {fc(i.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
