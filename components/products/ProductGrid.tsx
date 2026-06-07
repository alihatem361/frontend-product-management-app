"use client";

/**
 * ProductGrid.tsx
 *
 * The main product listing component. Reads filter state from Redux and
 * calls the appropriate RTK Query hook (search / category / all products).
 * Implements "Load More" infinite scroll using an IntersectionObserver sentinel.
 *
 * Architecture note:
 *  - Page 0 data is fetched immediately on mount.
 *  - `accumulatedProducts` is local state that grows as pages are loaded.
 *    We flush it when the filter changes so the list resets cleanly.
 *  - The IntersectionObserver watches a <div> at the bottom of the list.
 *    When it enters the viewport, `incrementPage` is dispatched.
 */

import { useEffect, useRef, useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { incrementPage, resetPage } from "@/features/filter/filterSlice";
import {
  useGetProductsQuery,
  useSearchProductsQuery,
  useGetProductsByCategoryQuery,
} from "@/features/api/dummyJsonApi";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import type { Product } from "@/types";

const LIMIT = 20;

/** Derive a stable key that represents the current filter combination */
function useFilterKey(searchQuery: string, selectedCategory: string | null) {
  return `${searchQuery}||${selectedCategory}`;
}

export function ProductGrid() {
  const mountedRef = useRef(false);
  const dispatch = useAppDispatch();
  const { searchQuery, selectedCategory, page } = useAppSelector(
    (s) => s.filter,
  );

  // Local accumulator: resets whenever the filter changes
  const filterKey = useFilterKey(searchQuery, selectedCategory);
  const prevFilterKeyRef = useRef(filterKey);
  const [accumulated, setAccumulated] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Reset accumulator and page when filter changes
  useEffect(() => {
    if (!mountedRef.current || prevFilterKeyRef.current !== filterKey) {
      mountedRef.current = true;
      prevFilterKeyRef.current = filterKey;
      setAccumulated([]);
      setHasMore(true);
      dispatch(resetPage());
    }
  }, [filterKey, dispatch]);

  const skip = page * LIMIT;

  // --- RTK Query conditional hooks ---
  // Rules of Hooks: all three hooks are always called; we use `skip` option to
  // suppress the inactive ones. RTK Query returns cached data instantly.

  const allProductsResult = useGetProductsQuery(
    { limit: LIMIT, skip },
    { skip: !!(searchQuery || selectedCategory) },
  );

  const searchResult = useSearchProductsQuery(
    { q: searchQuery, limit: LIMIT, skip },
    { skip: !searchQuery },
  );

  const categoryResult = useGetProductsByCategoryQuery(
    { category: selectedCategory ?? "", limit: LIMIT, skip },
    { skip: !selectedCategory || !!searchQuery },
  );

  // Select the active result
  const activeResult = searchQuery
    ? searchResult
    : selectedCategory
      ? categoryResult
      : allProductsResult;

  const { data, isFetching, isError } = activeResult;

  // Append new page data to the accumulator
  useEffect(() => {
    if (data?.products?.length) {
      setAccumulated((prev) => {
        // Deduplicate by id (safety net for double-renders)
        const existingIds = new Set(prev.map((p) => p.id));
        const newItems = data.products.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newItems];
      });
      // If API returned fewer items than requested, we've reached the end
      if (
        data.products.length < LIMIT ||
        accumulated.length + data.products.length >= data.total
      ) {
        setHasMore(false);
      }
    } else if (data && data.products.length === 0) {
      setHasMore(false);
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- IntersectionObserver sentinel ---
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const onSentinelVisible = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !isFetching && hasMore) {
        dispatch(incrementPage());
      }
    },
    [isFetching, hasMore, dispatch],
  );

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(onSentinelVisible, {
      rootMargin: "200px", // Start loading 200px before sentinel appears
    });
    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }
    return () => observerRef.current?.disconnect();
  }, [onSentinelVisible]);

  // --- Skeleton count for initial load ---
  const showInitialSkeletons = isFetching && accumulated.length === 0;
  const showLoadMoreSkeletons = isFetching && accumulated.length > 0;

  // --- Empty state ---
  const isEmpty = !isFetching && accumulated.length === 0;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-rose-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-slate-300 font-semibold">Failed to load products</p>
        <p className="text-slate-500 text-sm">
          Check your connection and try again.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* --- Product grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {/* Initial skeleton cards */}
        {showInitialSkeletons &&
          Array.from({ length: LIMIT }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}

        {/* Loaded product cards */}
        {accumulated.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {/* Load-more skeleton cards */}
        {showLoadMoreSkeletons &&
          Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={`more-${i}`} />
          ))}
      </div>

      {/* --- Empty state --- */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-white/5 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-slate-300 font-semibold">No products found</p>
          <p className="text-slate-500 text-sm">
            Try a different search term or category.
          </p>
        </div>
      )}

      {/* --- IntersectionObserver sentinel div --- */}
      {hasMore && <div ref={sentinelRef} className="h-px" aria-hidden="true" />}

      {/* --- End of list indicator --- */}
      {!hasMore && accumulated.length > 0 && (
        <p className="text-center text-slate-600 text-sm py-10">
          You&apos;ve seen all {accumulated.length} products
        </p>
      )}
    </div>
  );
}
