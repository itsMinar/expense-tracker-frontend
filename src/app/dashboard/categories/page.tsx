'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/category.service';
import { Button, Input, Select, Card, Dialog, Badge, TableSkeleton } from '@/components/ui';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Category } from '@/types';

const iconOptions = [
  { value: 'folder', label: 'Folder' },
  { value: 'shopping-cart', label: 'Shopping' },
  { value: 'utensils', label: 'Food' },
  { value: 'car', label: 'Transport' },
  { value: 'home', label: 'Home' },
  { value: 'heart', label: 'Health' },
  { value: 'book', label: 'Education' },
  { value: 'tv', label: 'Entertainment' },
  { value: 'briefcase', label: 'Work' },
  { value: 'gift', label: 'Gift' },
  { value: 'credit-card', label: 'Bills' },
  { value: 'phone', label: 'Utilities' },
];

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', icon: 'folder', color: '#6b7280', type: 'expense' });

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.list(),
  });

  const createMutation = useMutation({
    mutationFn: (d: any) => editing ? categoryService.update(editing._id, d) : categoryService.create(d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setShowForm(false); setEditing(null);
      setFormData({ name: '', icon: 'folder', color: '#6b7280', type: 'expense' });
      toast.success(editing ? 'Category updated' : 'Category created');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.delete,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); toast.success('Category deleted'); },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage your categories</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormData({ name: '', icon: 'folder', color: '#6b7280', type: 'expense' }); setShowForm(true); }}>
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {isLoading ? <TableSkeleton /> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories?.map((cat) => (
            <Card key={cat._id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: cat.color }}>
                  {cat.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{cat.name}</p>
                  <Badge variant="secondary" className="mt-1">{cat.type}</Badge>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => { setEditing(cat); setFormData({ name: cat.name, icon: cat.icon, color: cat.color, type: cat.type }); setShowForm(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(cat._id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm} title={editing ? 'Edit Category' : 'Create Category'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="cat-name" label="Name" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required />
          <Select id="cat-icon" label="Icon" options={iconOptions} value={formData.icon} onChange={(e) => setFormData(p => ({ ...p, icon: e.target.value }))} />
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground/80">Color</label>
            <input type="color" value={formData.color} onChange={(e) => setFormData(p => ({ ...p, color: e.target.value }))} className="h-9 w-full rounded-lg border border-input bg-background px-2" />
          </div>
          <Select id="cat-type" label="Type" options={[{ value: 'expense', label: 'Expense' }, { value: 'income', label: 'Income' }, { value: 'both', label: 'Both' }]} value={formData.type} onChange={(e) => setFormData(p => ({ ...p, type: e.target.value }))} />
          <Button type="submit" className="w-full" disabled={createMutation.isPending}>{editing ? 'Update' : 'Create'} Category</Button>
        </form>
      </Dialog>
    </div>
  );
}
