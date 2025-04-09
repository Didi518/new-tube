'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useRouter, useSearchParams } from 'next/navigation';

import { trpc } from '@/trpc/client';
import { FilterCarousel } from '@/components/filter-carousel';

interface CategoriesSectionProps {
  categoryId?: string;
}

export const CategoriesSection = ({ categoryId }: CategoriesSectionProps) => {
  return (
    <Suspense fallback={<CategoriesSkeleton />}>
      <ErrorBoundary fallback={<p>Erreur...</p>}>
        <CategoriesSectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const CategoriesSkeleton = () => {
  return <FilterCarousel isLoading data={[]} onSelectAction={() => {}} />;
};

const CategoriesSectionSuspense = ({ categoryId }: CategoriesSectionProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const data = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const onSelectAction = (value: string | null) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);

      if (value) {
        url.searchParams.set('categoryId', value);
      } else {
        url.searchParams.delete('categoryId');
      }

      router.push(url.toString());
    }
  };

  return (
    <FilterCarousel
      onSelectAction={onSelectAction}
      value={categoryId || searchParams.get('categoryId')}
      data={data}
    />
  );
};
