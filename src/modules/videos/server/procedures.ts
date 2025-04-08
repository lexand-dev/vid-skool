import { z } from "zod";
import { mux } from "@/lib/mux";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { videos, videoUpdateSchema } from "@/db/schema";

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const videosRouter = createTRPCRouter({
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const [removedVideo] = await db
        .delete(videos)
        .where(
          and(
            eq(videos.userId, userId),
            eq(videos.id, input.id)
          ))
        .returning();
      
      if (!removedVideo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return removedVideo;
    }),
  update: protectedProcedure
    .input(videoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id, title, description, visibility, categoryId } = input;

      if (!id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Video ID is required" });
      }
      
      const [updatedVideo] = await db
        .update(videos)
        .set({
          title,
          description,
          visibility,
          categoryId,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(videos.userId, userId),
            eq(videos.id, id)
          )
        )
        .returning();
      
      if (!updatedVideo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      
      return updatedVideo;
    }),
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policy: ["public"],
        input: [
          {
            generated_subtitles: [
              {
                language_code: "en",
                name: "English",
              }
            ],
          }
        ],
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
        title: "New Video",
        muxStatus: "waiting",
        muxUploadId: upload.id,
      })
      .returning();

    return {
      video: video,
      url: upload.url
    };
  })
});
