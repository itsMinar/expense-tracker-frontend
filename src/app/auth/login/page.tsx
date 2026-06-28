'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { AuthForm } from '@/components/auth/auth-form';

export default function LoginPage() {
  const { login, isLoginLoading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <AuthForm
            fields={[
              { name: 'email', label: 'Email', type: 'email', placeholder: 'hello@example.com' },
              { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' },
            ]}
            onSubmit={(data) => login(data as { email: string; password: string })}
            isLoading={isLoginLoading}
            submitLabel="Sign in"
          />
        </div>
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <Link href="/auth/forgot-password" className="hover:text-foreground underline underline-offset-4">
            Forgot password?
          </Link>
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-foreground font-medium hover:underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
