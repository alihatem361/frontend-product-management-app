import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductDetailClient } from '@/components/products/ProductDetailClient';
import { ProductDetailSkeleton } from '@/components/ui/Skeleton';

/**
 * Dynamic product detail page — /products/[id]
 *
 * Next.js 16: params is a Promise<{ id: string }>.
 * We pass the raw Promise down to the Client Component which uses
 * React's `use()` API to unwrap it.
 *
 * generateMetadata also receives the Promise and awaits it.
 */

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Product #${id}`,
    description: `View details, images, and reviews for product ${id} on ProductHub.`,
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      {/* Pass the Promise down; ProductDetailClient uses React.use() to read it */}
      <ProductDetailClient params={params} />
    </Suspense>
  );
}
