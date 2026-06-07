import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Spinner } from '@/components/ui/Spinner';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your ProductHub account.',
};

/**
 * Login page.
 * LoginForm uses `useSearchParams` which requires a Suspense boundary
 * in Next.js App Router for static rendering compatibility.
 */
export default function LoginPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
        <p className="text-slate-400">Sign in to your account to continue</p>
      </div>

      {/* Wrap in Suspense because LoginForm reads searchParams */}
      <Suspense
        fallback={
          <div className="flex justify-center py-10">
            <Spinner size="lg" className="text-violet-400" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
