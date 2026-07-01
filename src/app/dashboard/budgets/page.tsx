'use client';

import {
  Button,
  Card,
  CardSkeleton,
  ConfirmDialog,
  Dialog,
  EmptyState,
  Input,
  Select,
} from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { budgetService } from '@/services/budget.service';
import { categoryService } from '@/services/category.service';
import { Budget } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function BudgetsPage() {
  const queryClient = useQueryClient();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const { data: budgets, isLoading } = useQuery({
    queryKey: ['budgets', { month, year }],
    queryFn: () => budgetService.list({ month, year }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories', 'expense'],
    queryFn: () => categoryService.list('expense'),
  });

  const createMutation = useMutation({
    mutationFn: (d: any) =>
      editing ? budgetService.update(editing._id, d) : budgetService.create(d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      setShowForm(false);
      setEditing(null);
      setFormData({
        category: '',
        amount: '',
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });
      toast.success(editing ? 'Budget updated' : 'Budget created');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: budgetService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget deleted');
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Budgets</h1>
          <p className="text-sm text-muted-foreground">
            Set and track your budgets
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormData({
              category: '',
              amount: '',
              month: now.getMonth() + 1,
              year: now.getFullYear(),
            });
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add Budget
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex gap-3">
          <Select
            id="budget-month"
            options={Array.from({ length: 12 }, (_, i) => ({
              value: (i + 1).toString(),
              label: new Date(2000, i).toLocaleString('default', {
                month: 'long',
              }),
            }))}
            value={month.toString()}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          />
          <Select
            id="budget-year"
            options={Array.from({ length: 5 }, (_, i) => ({
              value: (now.getFullYear() - 2 + i).toString(),
              label: (now.getFullYear() - 2 + i).toString(),
            }))}
            value={year.toString()}
            onChange={(e) => setYear(parseInt(e.target.value))}
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : !budgets?.length ? (
        <EmptyState
          title="No budgets set"
          description="Create a budget to start tracking your spending"
          action={
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" /> Add Budget
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => (
            <Card key={budget._id} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: budget.category?.color }}
                  />
                  <h3 className="font-medium">{budget.category?.name}</h3>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditing(budget);
                      setFormData({
                        category: budget.category?._id || '',
                        amount: budget.amount.toString(),
                        month: budget.month,
                        year: budget.year,
                      });
                      setShowForm(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(budget._id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-muted-foreground">
                    {formatCurrency(budget.spent)} spent
                  </span>
                  <span className="text-muted-foreground">
                    of {formatCurrency(budget.amount)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${budget.isOverBudget ? 'bg-destructive' : 'bg-primary'}`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span
                  className={
                    budget.isOverBudget
                      ? 'text-destructive font-medium flex items-center gap-1'
                      : 'text-muted-foreground'
                  }
                >
                  {budget.isOverBudget && <AlertTriangle className="h-3 w-3" />}
                  {budget.percentage.toFixed(0)}% used
                </span>
                <span className="font-medium">
                  {formatCurrency(budget.remaining)} left
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={showForm}
        onOpenChange={setShowForm}
        title={editing ? 'Edit Budget' : 'Create Budget'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate({
              ...formData,
              amount: parseFloat(formData.amount),
            });
          }}
          className="space-y-4"
        >
          <Select
            id="budget-cat"
            label="Category"
            options={[
              { value: '', label: 'Select category' },
              ...(categories || []).map((c) => ({
                value: c._id,
                label: c.name,
              })),
            ]}
            value={formData.category}
            onChange={(e) =>
              setFormData((p) => ({ ...p, category: e.target.value }))
            }
            required
          />
          <Input
            id="budget-amount"
            label="Budget Amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              setFormData((p) => ({ ...p, amount: e.target.value }))
            }
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              id="budget-form-month"
              label="Month"
              options={Array.from({ length: 12 }, (_, i) => ({
                value: (i + 1).toString(),
                label: new Date(2000, i).toLocaleString('default', {
                  month: 'long',
                }),
              }))}
              value={formData.month.toString()}
              onChange={(e) =>
                setFormData((p) => ({ ...p, month: parseInt(e.target.value) }))
              }
            />
            <Select
              id="budget-form-year"
              label="Year"
              options={Array.from({ length: 5 }, (_, i) => ({
                value: (now.getFullYear() - 2 + i).toString(),
                label: (now.getFullYear() - 2 + i).toString(),
              }))}
              value={formData.year.toString()}
              onChange={(e) =>
                setFormData((p) => ({ ...p, year: parseInt(e.target.value) }))
              }
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={createMutation.isPending}
          >
            {editing ? 'Update Budget' : 'Create Budget'}
          </Button>
        </form>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Budget"
        message="Are you sure you want to delete this budget? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId);
        }}
      />
    </div>
  );
}
