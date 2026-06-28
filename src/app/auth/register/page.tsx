'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { AuthForm } from '@/components/auth/auth-form';

export default function RegisterPage() {
  const { register, isRegisterLoading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Get started with expense tracking
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <AuthForm
            fields={[
              { name: 'name', label: 'Name', placeholder: 'John Doe' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'hello@example.com' },
              { name: 'password', label: 'Password', type: 'password', placeholder: 'Create a password' },
            ]}
            onSubmit={(data) =>
              register(data as { name: string; email: string; password: string })
            }
            isLoading={isRegisterLoading}
            submitLabel="Create account"
          />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-foreground font-medium hover:underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
