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
import { formatCurrency, formatDate } from '@/lib/utils';
import { categoryService } from '@/services/category.service';
import { incomeService } from '@/services/income.service';
import { Income } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function IncomePage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Income | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    source: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['income', { page, search, category }],
    queryFn: () => incomeService.list({ page, limit: 10, search, category }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories', 'income'],
    queryFn: () => categoryService.list('income'),
  });

  const createMutation = useMutation({
    mutationFn: (d: any) =>
      editing ? incomeService.update(editing._id, d) : incomeService.create(d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income'] });
      setShowForm(false);
      setEditing(null);
      setFormData({
        title: '',
        amount: '',
        category: '',
        source: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      toast.success(editing ? 'Income updated' : 'Income added');
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || 'Failed to save income'),
  });

  const deleteMutation = useMutation({
    mutationFn: incomeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income'] });
      toast.success('Income deleted');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ ...formData, amount: parseFloat(formData.amount) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Income</h1>
          <p className="text-sm text-muted-foreground">Track your income</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormData({
              title: '',
              amount: '',
              category: '',
              source: '',
              date: new Date().toISOString().split('T')[0],
              notes: '',
            });
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add Income
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              id="search-income"
              placeholder="Search income..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            id="cat-filter"
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
        </div>
      </Card>

      {isLoading ? (
        <TableSkeleton />
      ) : !data?.incomes.length ? (
        <EmptyState
          title="No income recorded"
          description="Add your first income entry"
          action={
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" /> Add Income
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
                  <th className="text-left p-4 font-medium">Source</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-right p-4 font-medium">Amount</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.incomes.map((income) => (
                  <tr
                    key={income._id}
                    className="border-b last:border-0 hover:bg-muted/50"
                  >
                    <td className="p-4 font-medium">{income.title}</td>
                    <td className="p-4">
                      <Badge variant="outline">{income.category?.name}</Badge>
                    </td>
                    <td className="p-4 text-sm">{income.source || '-'}</td>
                    <td className="p-4 text-sm">{formatDate(income.date)}</td>
                    <td className="p-4 text-right font-medium text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(income.amount)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditing(income);
                            setFormData({
                              title: income.title,
                              amount: income.amount.toString(),
                              category: income.category?._id || '',
                              source: income.source || '',
                              date: income.date.split('T')[0],
                              notes: income.notes || '',
                            });
                            setShowForm(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(income._id)}
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
        title={editing ? 'Edit Income' : 'Add Income'}
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
            />
          </div>
          <Select
            id="income-cat"
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
            id="source"
            label="Source"
            value={formData.source}
            onChange={(e) =>
              setFormData((p) => ({ ...p, source: e.target.value }))
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
          <Button
            type="submit"
            className="w-full"
            disabled={createMutation.isPending}
          >
            {editing ? 'Update Income' : 'Add Income'}
          </Button>
        </form>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Income"
        message="Are you sure you want to delete this income entry? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId);
        }}
      />
    </div>
  );
}
