'use client';

/**
 * CategoryFilter.tsx
 *
 * Fetches categories from RTK Query and renders them as scrollable chip pills.
 * Active chip is highlighted; clicking dispatches to filterSlice.
 */

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setSelectedCategory } from '@/features/filter/filterSlice';
import { useGetCategoriesQuery } from '@/features/api/dummyJsonApi';
import { Skeleton } from '@/components/ui/Skeleton';

export function CategoryFilter() {
  const dispatch = useAppDispatch();
  const selectedCategory = useAppSelector((s) => s.filter.selectedCategory);
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();

  function handleSelect(slug: string | null) {
    dispatch(setSelectedCategory(slug === selectedCategory ? null : slug));
  }

  if (isError) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
      {/* "All" chip */}
      <CategoryChip
        label="All"
        active={selectedCategory === null}
        onClick={() => dispatch(setSelectedCategory(null))}
      />

      {/* Loading skeletons */}
      {isLoading &&
        Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 shrink-0 rounded-full" />
        ))}

      {/* Category chips */}
      {categories?.map((cat) => (
        <CategoryChip
          key={cat.slug}
          label={cat.name}
          active={selectedCategory === cat.slug}
          onClick={() => handleSelect(cat.slug)}
        />
      ))}
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium',
        'transition-all duration-200 whitespace-nowrap',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
        active
          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/30'
          : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-700/80 border border-white/5',
      ].join(' ')}
    >
      {label}
    </button>
  );
}
