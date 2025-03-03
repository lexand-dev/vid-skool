"use client";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";

export const VideoSection = () => {
  const [data] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor
    }
  );

  return (
    <div>
      <h1>Video Section</h1>
      {JSON.stringify(data)}
    </div>
  );
};
