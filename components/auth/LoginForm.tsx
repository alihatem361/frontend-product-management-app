'use client';

/**
 * LoginForm.tsx
 *
 * Login form component using RTK Query mutation.
 * On success: stores credentials in Redux + cookie and redirects to home.
 * Displays field-level validation errors and API error messages.
 */

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLoginMutation } from '@/features/api/dummyJsonApi';
import { setCredentials } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// Eye icons for password toggle
const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

interface FormErrors {
  username?: string;
  password?: string;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [login, { isLoading, error }] = useLoginMutation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  /** Client-side validation before submitting */
  function validate(): boolean {
    const errors: FormErrors = {};
    if (!username.trim()) errors.username = 'Username is required';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 4) errors.password = 'Password must be at least 4 characters';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      const user = await login({ username: username.trim(), password }).unwrap();
      // Save credentials to Redux (also persists token to cookie)
      dispatch(setCredentials(user));
      // Redirect to the intended page or home
      const callbackUrl = searchParams.get('callbackUrl') ?? '/';
      router.replace(callbackUrl);
    } catch {
      // Error displayed from RTK Query `error` state below
    }
  }

  /** Extract a human-readable message from RTK Query error */
  const apiError =
    error && 'data' in error
      ? (error.data as { message?: string })?.message ?? 'Login failed. Please try again.'
      : error
      ? 'Network error. Please check your connection.'
      : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* API error banner */}
      {apiError && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-300"
        >
          <svg className="w-4 h-4 shrink-0 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {apiError}
        </div>
      )}

      {/* Username field */}
      <Input
        id="login-username"
        label="Username"
        type="text"
        placeholder="e.g. emilys"
        autoComplete="username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          if (formErrors.username) setFormErrors((p) => ({ ...p, username: undefined }));
        }}
        error={formErrors.username}
        leftIcon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />

      {/* Password field */}
      <Input
        id="login-password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter your password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (formErrors.password) setFormErrors((p) => ({ ...p, password: undefined }));
        }}
        error={formErrors.password}
        leftIcon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        }
      />

      {/* Hint about test credentials */}
      <p className="text-xs text-slate-500">
        Demo credentials: <span className="text-slate-300 font-mono">emilys</span> /{' '}
        <span className="text-slate-300 font-mono">emilyspass</span>
      </p>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        isLoading={isLoading}
        className="w-full"
      >
        Sign In
      </Button>

      {/* Link to register */}
      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
