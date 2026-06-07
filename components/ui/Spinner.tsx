'use client';

/**
 * Spinner.tsx — Animated loading spinner
 */

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
};

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={[
        'inline-block rounded-full border-current border-t-transparent animate-spin',
        sizeMap[size],
        className,
      ].join(' ')}
    />
  );
}

/** Full-page loading overlay */
export function PageSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" className="text-violet-400" />
        <p className="text-sm text-slate-400 animate-pulse">Loading…</p>
      </div>
    </div>
  );
}
