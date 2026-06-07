'use client';

/**
 * ProductCard.tsx
 *
 * Reusable card that displays a product thumbnail, title, category, rating, and price.
 * Navigates to the product detail page on click.
 * Uses Next.js Image for optimized lazy loading.
 */

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Pick<Product, 'id' | 'title' | 'price' | 'thumbnail' | 'category' | 'rating' | 'stock'>;
}

/** Star rating display (out of 5) */
function StarRating({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3 h-3 ${i < filled ? 'text-amber-400' : 'text-slate-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-slate-400">{rating.toFixed(1)}</span>
    </span>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const { id, title, price, thumbnail, category, rating, stock } = product;
  const isLowStock = stock > 0 && stock <= 10;
  const isOutOfStock = stock === 0;

  return (
    <Link
      href={`/products/${id}`}
      id={`product-card-${id}`}
      className={[
        'group flex flex-col rounded-2xl overflow-hidden',
        'bg-slate-900/60 border border-white/5',
        'hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1',
      ].join(' ')}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-52 overflow-hidden bg-slate-800/60">
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Stock badges */}
        {isOutOfStock && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-600/90 text-white backdrop-blur-sm">
            Out of stock
          </span>
        )}
        {isLowStock && !isOutOfStock && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/90 text-white backdrop-blur-sm">
            Low stock
          </span>
        )}

        {/* Category pill */}
        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-900/80 text-slate-300 backdrop-blur-sm border border-white/10 capitalize">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Title */}
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-violet-300 transition-colors">
          {title}
        </h3>

        {/* Rating */}
        <StarRating rating={rating} />

        {/* Price row */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            ${price.toFixed(2)}
          </span>
          <span
            className={[
              'flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl font-semibold',
              'bg-gradient-to-r from-violet-600/20 to-indigo-600/20',
              'text-violet-300 border border-violet-500/20',
              'group-hover:from-violet-600 group-hover:to-indigo-600',
              'group-hover:text-white group-hover:border-transparent',
              'transition-all duration-300',
            ].join(' ')}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            View
          </span>
        </div>
      </div>
    </Link>
  );
}
