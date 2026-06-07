'use client';

/**
 * ProductDetailClient.tsx
 *
 * Client Component that fetches and renders the product detail.
 * Separated from the page so we can use RTK Query hooks (client-side)
 * while the page shell itself is a Server Component.
 */

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { useGetProductByIdQuery } from '@/features/api/dummyJsonApi';
import { Button } from '@/components/ui/Button';
import { ProductDetailSkeleton } from '@/components/ui/Skeleton';

/** Star rating display */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < Math.round(rating) ? 'text-amber-400' : 'text-slate-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </span>
      <span className="text-sm text-slate-400">
        {rating.toFixed(1)} <span className="text-slate-600">/ 5</span>
      </span>
    </div>
  );
}

/** Info row (label + value pair) */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/5 last:border-0">
      <span className="text-sm text-slate-400 shrink-0">{label}</span>
      <span className="text-sm text-white text-right">{value}</span>
    </div>
  );
}

interface Props {
  params: Promise<{ id: string }>;
}

export function ProductDetailClient({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const productId = parseInt(id, 10);

  const { data: product, isLoading, isError } = useGetProductByIdQuery(productId);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Loading state
  if (isLoading) return <ProductDetailSkeleton />;

  // Error state
  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-slate-300 font-semibold text-lg">Product not found</p>
        <Button variant="secondary" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const allImages = product.images?.length ? product.images : [product.thumbnail];

  return (
    <article className="space-y-10">
      {/* ── Back button ── */}
      <Button
        id="product-back-button"
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        leftIcon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        }
      >
        Back to products
      </Button>

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

        {/* ── Image gallery ── */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-900/60 border border-white/5">
            <Image
              src={allImages[activeImageIdx]}
              alt={`${product.title} — image ${activeImageIdx + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-4"
              priority
            />

            {/* Discount badge */}
            {product.discountPercentage > 0 && (
              <span className="absolute top-4 right-4 px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-600 text-white shadow-lg">
                -{Math.round(product.discountPercentage)}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImageIdx(i)}
                  aria-label={`View image ${i + 1}`}
                  className={[
                    'relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200',
                    i === activeImageIdx
                      ? 'border-violet-500 shadow-md shadow-violet-500/30'
                      : 'border-white/10 hover:border-white/30',
                  ].join(' ')}
                >
                  <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product info ── */}
        <div className="space-y-6">
          {/* Category badge */}
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/20 capitalize">
            {product.category}
          </span>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
            {product.title}
          </h1>

          {/* Rating + reviews */}
          <div className="flex items-center gap-3 flex-wrap">
            <Stars rating={product.rating} />
            <span className="text-sm text-slate-500">
              {product.reviews?.length ?? 0} reviews
            </span>
          </div>

          {/* Price block */}
          <div className="flex items-end gap-3 flex-wrap">
            <span className="text-4xl font-extrabold text-white">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-xl text-slate-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-slate-400 leading-relaxed text-sm">
            {product.description}
          </p>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg text-xs text-slate-400 bg-slate-800/60 border border-white/5 capitalize"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <hr className="border-white/5" />

          {/* Product details grid */}
          <div className="rounded-2xl bg-slate-900/60 border border-white/5 px-4 divide-y-0">
            {product.brand && <InfoRow label="Brand" value={product.brand} />}
            <InfoRow label="SKU" value={product.sku} />
            <InfoRow
              label="Stock"
              value={
                product.stock === 0
                  ? 'Out of stock'
                  : `${product.stock} units — ${product.availabilityStatus}`
              }
            />
            <InfoRow label="Warranty" value={product.warrantyInformation} />
            <InfoRow label="Shipping" value={product.shippingInformation} />
            <InfoRow label="Return Policy" value={product.returnPolicy} />
            <InfoRow label="Min. Order" value={`${product.minimumOrderQuantity} unit(s)`} />
          </div>

          {/* Brand / weight */}
          <div className="flex gap-3 text-xs text-slate-500">
            {product.weight && <span>Weight: {product.weight}g</span>}
            {product.dimensions && (
              <span>
                {product.dimensions.width}×{product.dimensions.height}×{product.dimensions.depth} cm
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Reviews section ── */}
      {product.reviews?.length > 0 && (
        <section className="space-y-4" aria-label="Customer reviews">
          <h2 className="text-xl font-bold text-white">Customer Reviews</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {product.reviews.map((review, i) => (
              <div
                key={i}
                className="rounded-2xl bg-slate-900/60 border border-white/5 p-5 space-y-3"
              >
                {/* Reviewer */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{review.reviewerName}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <Stars rating={review.rating} />
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
