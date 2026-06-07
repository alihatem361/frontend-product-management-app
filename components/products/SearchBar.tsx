'use client';

/**
 * SearchBar.tsx
 *
 * Debounced search input that dispatches to filterSlice.
 * Clears any active category filter when the user types.
 */

import { useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setSearchQuery } from '@/features/filter/filterSlice';

export function SearchBar() {
  const dispatch = useAppDispatch();
  const currentQuery = useAppSelector((s) => s.filter.searchQuery);
  const [localValue, setLocalValue] = useState(currentQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep local value in sync when Redux state is reset (e.g. category click)
  useEffect(() => {
    setLocalValue(currentQuery);
  }, [currentQuery]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setLocalValue(val);

    // Debounce 350 ms — avoids firing an API call on every keystroke
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(setSearchQuery(val));
    }, 350);
  }

  function handleClear() {
    setLocalValue('');
    dispatch(setSearchQuery(''));
  }

  return (
    <div className="relative w-full max-w-xl">
      {/* Search icon */}
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>

      <input
        id="product-search"
        type="search"
        value={localValue}
        onChange={handleChange}
        placeholder="Search products…"
        className={[
          'w-full rounded-2xl border bg-slate-900/70 pl-10 pr-10 py-3 text-sm text-white',
          'placeholder:text-slate-500 backdrop-blur-sm',
          'border-white/10 hover:border-white/20',
          'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
          'transition-all duration-200',
        ].join(' ')}
      />

      {/* Clear button */}
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
