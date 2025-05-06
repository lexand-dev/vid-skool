"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { FilterCarousel } from "@/components/filter-carousel";

interface CategoriesSectionProps {
  categoryId?: string;
}

export const CategoriesSection = ({ categoryId }: CategoriesSectionProps) => {
  return (
    <Suspense
      fallback={<FilterCarousel isLoading data={[]} onSelect={() => {}} />}
    >
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <CategoriesSectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const CategoriesSectionSuspense = ({
  categoryId
}: CategoriesSectionProps) => {
  const router = useRouter();
  const [data] = trpc.categories.getMany.useSuspenseQuery();

  const categories = data.map((category) => ({
    value: category.id,
    label: category.name
  }));

  const onSelect = (value: string | null) => {
    const url = new URL(window.location.href);

    if (value) {
      url.searchParams.set("categoryId", value);
    } else {
      url.searchParams.delete("categoryId");
    }

    return router.push(url.toString());
  };

  return (
    <FilterCarousel onSelect={onSelect} data={categories} value={categoryId} />
  );
};
