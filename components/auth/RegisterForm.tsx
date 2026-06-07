'use client';

/**
 * RegisterForm.tsx
 *
 * Mock registration form.
 * Calls POST /users/add on DummyJSON (simulates user creation — does not persist).
 * On success: auto-logs the user in (stores returned token in Redux + cookie).
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegisterMutation } from '@/features/api/dummyJsonApi';
import { setCredentials } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors extends Partial<FormData> {}

export function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading, error }] = useRegisterMutation();

  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  /** Client-side validation */
  function validate(): boolean {
    const errors: FormErrors = {};
    if (!form.firstName.trim()) errors.firstName = 'First name is required';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required';
    if (!form.username.trim()) errors.username = 'Username is required';
    else if (form.username.length < 3) errors.username = 'Must be at least 3 characters';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!form.password) errors.password = 'Password is required';
    else if (form.password.length < 6) errors.password = 'Must be at least 6 characters';
    if (form.confirmPassword !== form.password) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      const user = await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      }).unwrap();

      setSuccess(true);

      // DummyJSON returns a partial user object; auto-login if token is present
      if (user.token) {
        dispatch(setCredentials(user));
        setTimeout(() => router.replace('/'), 1200);
      } else {
        // Fallback: redirect to login
        setTimeout(() => router.replace('/login'), 1200);
      }
    } catch {
      // Error displayed from RTK Query `error` state
    }
  }

  const apiError =
    error && 'data' in error
      ? (error.data as { message?: string })?.message ?? 'Registration failed.'
      : error
      ? 'Network error. Please check your connection.'
      : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Success banner */}
      {success && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-300"
        >
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Account created! Redirecting you…
        </div>
      )}

      {/* API error banner */}
      {apiError && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-300"
        >
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {apiError}
        </div>
      )}

      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          id="register-first-name"
          label="First Name"
          placeholder="John"
          autoComplete="given-name"
          value={form.firstName}
          onChange={(e) => updateField('firstName', e.target.value)}
          error={formErrors.firstName}
        />
        <Input
          id="register-last-name"
          label="Last Name"
          placeholder="Doe"
          autoComplete="family-name"
          value={form.lastName}
          onChange={(e) => updateField('lastName', e.target.value)}
          error={formErrors.lastName}
        />
      </div>

      {/* Username */}
      <Input
        id="register-username"
        label="Username"
        placeholder="johndoe"
        autoComplete="username"
        value={form.username}
        onChange={(e) => updateField('username', e.target.value)}
        error={formErrors.username}
        leftIcon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />

      {/* Email */}
      <Input
        id="register-email"
        label="Email"
        type="email"
        placeholder="john@example.com"
        autoComplete="email"
        value={form.email}
        onChange={(e) => updateField('email', e.target.value)}
        error={formErrors.email}
        leftIcon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        }
      />

      {/* Password */}
      <Input
        id="register-password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Min. 6 characters"
        autoComplete="new-password"
        value={form.password}
        onChange={(e) => updateField('password', e.target.value)}
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
            {showPassword ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        }
      />

      {/* Confirm password */}
      <Input
        id="register-confirm-password"
        label="Confirm Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Re-enter your password"
        autoComplete="new-password"
        value={form.confirmPassword}
        onChange={(e) => updateField('confirmPassword', e.target.value)}
        error={formErrors.confirmPassword}
        leftIcon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        }
      />

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        isLoading={isLoading}
        disabled={success}
        className="w-full mt-2"
      >
        Create Account
      </Button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
