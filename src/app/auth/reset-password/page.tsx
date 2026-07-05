'use client';

import { Button, Input } from '@/components/ui';
import { authService } from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const resetSchema = z.object({
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: { password: string }) => {
    setLoading(true);
    try {
      await authService.resetPassword({ token, password: data.password });
      setDone(true);
      toast.success('Password reset successful');
    } catch {
      toast.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Password reset successful</h1>
        <Link href="/auth/login">
          <Button>Sign in with new password</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-sm text-muted-foreground">Enter your new password</p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border bg-card p-6 shadow-sm space-y-4"
      >
        <Input
          id="password"
          label="New Password"
          type="password"
          placeholder="Enter new password"
          error={errors.password?.message as string}
          {...register('password')}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset password'}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
