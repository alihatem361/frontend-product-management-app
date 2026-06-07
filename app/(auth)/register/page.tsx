import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a new ProductHub account to start browsing.',
};

export default function RegisterPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Create account</h1>
        <p className="text-slate-400">Join ProductHub and start exploring</p>
      </div>

      <RegisterForm />
    </div>
  );
}
