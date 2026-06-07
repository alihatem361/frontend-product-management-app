/**
 * Auth layout — centers auth forms with a beautiful split-screen design.
 * Left panel: branding + decorative art
 * Right panel: the form (login or register)
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your ProductHub account to access the product catalog.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left panel: Branding (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950" />

        {/* Decorative orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-violet-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-5%] right-[-5%] w-80 h-80 bg-indigo-600/25 rounded-full blur-3xl" />
        <div className="absolute top-[40%] left-[30%] w-48 h-48 bg-fuchsia-600/20 rounded-full blur-2xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">ProductHub</span>
          </div>

          {/* Headline */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold leading-tight">
                <span className="text-white">Discover your</span>
                <br />
                <span className="gradient-text">next favorite</span>
                <br />
                <span className="text-white">product</span>
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                Browse thousands of products across dozens of categories with lightning-fast search and smart filtering.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex gap-8">
              {[
                { value: '194+', label: 'Products' },
                { value: '20+', label: 'Categories' },
                { value: '100%', label: 'Free API' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-sm text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom quote */}
          <blockquote className="border-l-2 border-violet-500 pl-4">
            <p className="text-slate-400 text-sm italic">
              &ldquo;A seamless product discovery experience, built for the modern web.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

      {/* ── Right panel: Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-slate-950">
        {/* Mobile logo */}
        <div className="flex items-center gap-2.5 mb-10 lg:hidden">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight">ProductHub</span>
        </div>

        {/* Form card */}
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
