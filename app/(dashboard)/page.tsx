import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchBar } from '@/components/products/SearchBar';
import { CategoryFilter } from '@/components/products/CategoryFilter';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Skeleton } from '@/components/ui/Skeleton';

export const metadata: Metadata = {
  title: 'Products — Browse the Catalog',
  description:
    'Browse and search through hundreds of products across all categories on ProductHub.',
};

/**
 * Home page — Product list with search, category filter, and infinite scroll.
 * All child components are Client Components (they use Redux state),
 * so we wrap async boundaries with Suspense for clean server rendering.
 */
export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          All Products
        </h1>
        <p className="text-slate-400 text-sm">
          Discover our full catalog — search, filter, and explore.
        </p>
      </div>

      {/* ── Search bar ── */}
      <Suspense fallback={<Skeleton className="h-12 w-full max-w-xl rounded-2xl" />}>
        <SearchBar />
      </Suspense>

      {/* ── Category chips ── */}
      <Suspense
        fallback={
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full shrink-0" />
            ))}
          </div>
        }
      >
        <CategoryFilter />
      </Suspense>

      {/* ── Product grid ── */}
      <Suspense fallback={null}>
        <ProductGrid />
      </Suspense>
    </div>
  );
}
