import { HydrateClient, trpc } from "@/trpc/server";

import { DEFAULT_LIMIT } from "@/constants";
import { Homeview } from "@/modules/home/ui/views/home-view";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ categoryId: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const { categoryId } = await searchParams;

  void trpc.categories.getMany.prefetch();
  void trpc.video.getMany.prefetchInfinite({
    categoryId,
    limit: DEFAULT_LIMIT
  });

  return (
    <HydrateClient>
      <Homeview categoryId={categoryId} />
    </HydrateClient>
  );
};

export default Page;
