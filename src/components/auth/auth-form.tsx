'use client';

import { Button, Input } from '@/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface AuthFormField {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

interface AuthFormProps {
  fields: AuthFormField[];
  schema: z.ZodSchema;
  onSubmit: (data: unknown) => void;
  isLoading?: boolean;
  submitLabel: string;
}

export function AuthForm({
  fields,
  schema,
  onSubmit,
  isLoading,
  submitLabel,
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      schema as unknown as Parameters<typeof zodResolver>[0]
    ),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field) => {
        const errMsg = errors[field.name]?.message as string | undefined;
        return (
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
              error={errMsg}
              {...register(field.name)}
            />
            {field.type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        );
      })}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
