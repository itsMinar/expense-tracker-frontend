'use client';

import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  Dialog,
  EmptyState,
  Input,
  Select,
  TableSkeleton,
} from '@/components/ui';
import { useCurrency } from '@/hooks/use-currency';
import { formatDate } from '@/lib/utils';
import { categoryService } from '@/services/category.service';
import { expenseService } from '@/services/expense.service';
import { Expense } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ExpensesPage() {
  const queryClient = useQueryClient();
  const { formatCurrency: fc } = useCurrency();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('-date');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    paymentMethod: 'cash',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    tags: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['expenses', { page, search, category, sort }],
    queryFn: () =>
      expenseService.list({
        page,
        limit: 10,
        search,
        category,
        sort: sort === 'date' ? '-date' : sort,
      }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories', 'expense'],
    queryFn: () => categoryService.list('expense'),
  });

  const createMutation = useMutation({
    mutationFn: (d: any) =>
      editing
        ? expenseService.update(editing._id, d)
        : expenseService.create(d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setShowForm(false);
      setEditing(null);
      setFormData({
        title: '',
        amount: '',
        category: '',
        description: '',
        paymentMethod: 'cash',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        tags: '',
      });
      toast.success(editing ? 'Expense updated' : 'Expense added');
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || 'Failed to save expense'),
  });

  const deleteMutation = useMutation({
    mutationFn: expenseService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense deleted');
    },
  });

  const openEdit = (expense: Expense) => {
    setEditing(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category?._id || '',
      description: expense.description || '',
      paymentMethod: expense.paymentMethod,
      date: expense.date.split('T')[0],
      notes: expense.notes || '',
      tags: expense.tags?.join(', ') || '',
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      amount: parseFloat(formData.amount),
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
    });
  };

  const paymentMethodColors: Record<string, string> = {
    cash: 'default',
    credit_card: 'warning',
    debit_card: 'secondary',
    bank_transfer: 'success',
    other: 'outline',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-sm text-muted-foreground">Manage your expenses</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormData({
              title: '',
              amount: '',
              category: '',
              description: '',
              paymentMethod: 'cash',
              date: new Date().toISOString().split('T')[0],
              notes: '',
              tags: '',
            });
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add Expense
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              id="search"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            id="category-filter"
            options={[
              { value: '', label: 'All Categories' },
              ...(categories || []).map((c) => ({
                value: c._id,
                label: c.name,
              })),
            ]}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          />
          <Select
            id="sort"
            options={[
              { value: '-date', label: 'Newest' },
              { value: 'date', label: 'Oldest' },
              { value: '-amount', label: 'Highest Amount' },
              { value: 'amount', label: 'Lowest Amount' },
            ]}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          />
        </div>
      </Card>

      {isLoading ? (
        <TableSkeleton />
      ) : !data?.expenses.length ? (
        <EmptyState
          title="No expenses found"
          description="Add your first expense to get started"
          action={
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" /> Add Expense
            </Button>
          }
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-sm text-muted-foreground">
                  <th className="text-left p-4 font-medium">Title</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Payment</th>
                  <th className="text-right p-4 font-medium">Amount</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.expenses.map((expense) => (
                  <tr
                    key={expense._id}
                    className="border-b last:border-0 hover:bg-muted/50"
                  >
                    <td className="p-4">
                      <p className="font-medium">{expense.title}</p>
                      {expense.description && (
                        <p className="text-xs text-muted-foreground">
                          {expense.description}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        style={{ borderColor: expense.category?.color }}
                      >
                        {expense.category?.name}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">{formatDate(expense.date)}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          (paymentMethodColors[expense.paymentMethod] ||
                            'outline') as any
                        }
                      >
                        {expense.paymentMethod.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4 text-right font-medium">
                      {fc(expense.amount)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(expense)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(expense._id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data?.pagination && data.pagination.pages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-muted-foreground">
                Page {data.pagination.page} of {data.pagination.pages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= (data.pagination.pages || 1)}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      <Dialog
        open={showForm}
        onOpenChange={setShowForm}
        title={editing ? 'Edit Expense' : 'Add Expense'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="title"
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData((p) => ({ ...p, title: e.target.value }))
            }
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="amount"
              label="Amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData((p) => ({ ...p, amount: e.target.value }))
              }
              required
            />
            <Input
              id="date"
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((p) => ({ ...p, date: e.target.value }))
              }
              required
            />
          </div>
          <Select
            id="expense-category"
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
          <Select
            id="payment"
            label="Payment Method"
            options={[
              { value: 'cash', label: 'Cash' },
              { value: 'credit_card', label: 'Credit Card' },
              { value: 'debit_card', label: 'Debit Card' },
              { value: 'bank_transfer', label: 'Bank Transfer' },
              { value: 'other', label: 'Other' },
            ]}
            value={formData.paymentMethod}
            onChange={(e) =>
              setFormData((p) => ({ ...p, paymentMethod: e.target.value }))
            }
          />
          <Input
            id="desc"
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData((p) => ({ ...p, description: e.target.value }))
            }
          />
          <Input
            id="notes"
            label="Notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData((p) => ({ ...p, notes: e.target.value }))
            }
          />
          <Input
            id="tags"
            label="Tags (comma separated)"
            value={formData.tags}
            onChange={(e) =>
              setFormData((p) => ({ ...p, tags: e.target.value }))
            }
          />
          <Button
            type="submit"
            className="w-full"
            disabled={createMutation.isPending}
          >
            {editing ? 'Update Expense' : 'Add Expense'}
          </Button>
        </form>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId);
        }}
      />
    </div>
  );
}
