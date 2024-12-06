import { Suspense } from 'react';

import PaginationBar from '@/components/PaginationBar';
import Product from '@/components/Product';
import { delay } from '@/lib/utils';
import { getWixServerClient } from '@/lib/wix-client-server';
import { ProductsSort, queryProducts } from '@/wix-api/products';
import { notFound } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';

interface ShopPageRouteProps {
  searchParams: {
    q?: string;
    page?: string;
    collection?: string[];
    price_min?: string;
    price_max?: string;
    sort?: string;
  };
}

export function generateMetaData({ searchParams: { q } }: ShopPageRouteProps) {
  return {
    title: q ? `Search: ${q}` : 'Products',
  };
}

export default function ShopPageRoute({
  searchParams: { q, page = '1', collection: collectionIds, price_min, price_max, sort },
}: ShopPageRouteProps) {
  const title = q ? `Search: ${q}` : 'Products';
  return (
    <div className='space-y-10'>
      <h1 className='text-center text-3xl font-bold md:text-4xl'>{title}</h1>
      <Suspense fallback={<LoadingSkeleton />} key={`${q}-${page}`}>
        <ProductResults
          q={q}
          page={parseInt(page)}
          collectionIds={collectionIds}
          priceMin={price_min ? parseInt(price_min) : undefined}
          priceMax={price_max ? parseInt(price_max) : undefined}
          sort={sort as ProductsSort}
        />
      </Suspense>
    </div>
  );
}

interface ProductResultsProps {
  q?: string;
  page: number;
  collectionIds?: string[];
  priceMin?: number;
  priceMax?: number;
  sort?: ProductsSort;
}

async function ProductResults({
  q,
  page,
  collectionIds,
  priceMin,
  priceMax,
  sort,
}: ProductResultsProps) {
  await delay(2000);
  const pageSize = 8;
  const products = await queryProducts(getWixServerClient(), {
    q,
    limit: pageSize,
    skip: (page - 1) * pageSize,
    collectionIds,
    priceMin,
    priceMax,
    sort,
  });

  if (page > (products.totalPages || 1)) return notFound();

  return (
    <div className='space-y-10 group-has-[[data-pending]]:animate-pulse'>
      <p className='text-center text-xl'>
        {products.totalCount} {products.totalCount === 1 ? 'product' : 'products'} found
      </p>
      <div className='flex grid-cols-2 flex-col gap-5 sm:grid xl:grid-cols-3 2xl:grid-cols-4'>
        {products.items.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
      <PaginationBar currentPage={page} totalPages={products.totalPages || 1} />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className='space-y-10'>
      <Skeleton className='w52 mx-auto h-9' />
      <div className='flex grid-cols-2 flex-col gap-5 sm:grid xl:grid-cols-3 2xl:grid-cols-4'>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className='h-[20rem]' />
        ))}
      </div>
    </div>
  );
}
