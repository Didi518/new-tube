'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';

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
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const data = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const onSelectAction = (value: string | null) => {
    const url = new URL(window.location.href);

    if (value) {
      url.searchParams.set('categorieId', value);
    } else {
      url.searchParams.delete('categorieId');
    }

    router.push(url.toString());
  };

  return (
    <FilterCarousel
      onSelectAction={onSelectAction}
      value={categoryId}
      data={data}
    />
  );
};
