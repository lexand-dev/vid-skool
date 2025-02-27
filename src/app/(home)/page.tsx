import { HydrateClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Home() {
	const { greeting } = await trpc.hello({ text: "desde trpc server" });

	return (
		<HydrateClient>
			<div>
				<p>
					<Suspense fallback={<div>Loading...</div>}>
						<ErrorBoundary fallback={<div>Something went wrong</div>}>
							Welcome to the <strong>Home</strong> page. {greeting}
						</ErrorBoundary>
					</Suspense>
				</p>
			</div>
		</HydrateClient>
	);
}
