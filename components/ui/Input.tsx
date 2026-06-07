'use client';

/**
 * Input.tsx — Reusable form input with label, error, and icon support
 */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, helperText, id, className = '', ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-300"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={[
              // Base
              'w-full rounded-xl border bg-slate-800/60 px-4 py-2.5 text-sm text-white',
              'placeholder:text-slate-500 backdrop-blur-sm',
              'transition-all duration-200',
              // Focus
              'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
              // Error state
              error
                ? 'border-rose-500/60 focus:ring-rose-500'
                : 'border-white/10 hover:border-white/20',
              // Icon padding adjustments
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              className,
            ].join(' ')}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-xs text-rose-400 flex items-center gap-1">
            <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {/* Helper text */}
        {!error && helperText && (
          <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
