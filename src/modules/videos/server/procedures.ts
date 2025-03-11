import { db } from "@/db";
import { mux } from "@/lib/mux";
import { videos } from "@/db/schema";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const videosRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policy: ["public"],
        static_renditions: [
          {
            resolution: "highest"
          }
        ]
      },
      cors_origin: "*" // TODO: Set this to the domain of your app in production
    });

    const [video] = await db
      .insert(videos)
      .values({
        userId,
        title: "New Video"
      })
      .returning();

    return {
      video: video,
      url: upload.url
    };
  })
});
