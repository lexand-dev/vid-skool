import { HydrateClient, trpc } from "@/trpc/server";

import { Homeview } from "@/modules/home/ui/views/home-view";

export const dynamic = "force-dynamic";

interface PageProps {
	searchParams: Promise<{ categoryId: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
	const { categoryId } = await searchParams;

	void trpc.categories.getMany.prefetch();

	return (
		<HydrateClient>
			<Homeview categoryId={categoryId} />
		</HydrateClient>
	);
};

export default Page;
