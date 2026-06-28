'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button, Input } from '@/components/ui';

interface AuthFormField {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

interface AuthFormProps {
  fields: AuthFormField[];
  onSubmit: (data: Record<string, string>) => void;
  isLoading?: boolean;
  submitLabel: string;
}

export function AuthForm({ fields, onSubmit, isLoading, submitLabel }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const hasPassword = fields.some((f) => f.type === 'password');

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="relative">
          <Input
            id={field.name}
            label={field.label}
            type={
              field.type === 'password'
                ? showPassword
                  ? 'text'
                  : 'password'
                : field.type || 'text'
            }
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
            }
            required
          />
          {field.type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
      ))}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
