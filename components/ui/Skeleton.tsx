'use client';

/**
 * Skeleton.tsx — Animated skeleton loader placeholders
 * Used while async data is being fetched.
 */

interface SkeletonProps {
  className?: string;
}

/** Generic animated shimmer block */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        'animate-pulse rounded-lg bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800',
        'bg-[length:200%_100%] animate-shimmer',
        className,
      ].join(' ')}
    />
  );
}

/** Skeleton for a product card */
export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-white/5 overflow-hidden">
      {/* Image area */}
      <Skeleton className="w-full h-52" />
      {/* Content area */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between items-center pt-1">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/** Skeleton for the product detail page */
export function ProductDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-10">
      <Skeleton className="w-full h-96 rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-10 w-32 rounded-xl mt-4" />
      </div>
    </div>
  );
}
