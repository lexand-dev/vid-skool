import { z } from "zod";
import { mux } from "@/lib/mux";
import { and, eq, getTableColumns } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

import { db } from "@/db";
import { users, videos, videoUpdateSchema, videoViews } from "@/db/schema";

import { TRPCError } from "@trpc/server";
import { workflow } from "@/lib/workflow";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const videosRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const [existingVideo] = await db
        .select({
          ...getTableColumns(videos),
          user: {
            ...getTableColumns(users),
          },
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .where(eq(videos.id, input.id))

      if (!existingVideo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return existingVideo;
    }),
  generateThumbnail: protectedProcedure
    .input(z.object({ id: z.string().uuid(), prompt: z.string().min(10) }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/thumbnail`,
        body: { userId, videoId: input.id, prompt: input.prompt },
      });

      return workflowRunId;
    }),
  generateTitle: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
        body: { userId, videoId: input.id },
      });

      return workflowRunId;
  }),
  generateDescription: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/description`,
        body: { userId, videoId: input.id },
      });

      return workflowRunId;
  }),
  restoreThumbnail: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(
          and(
            eq(videos.userId, userId),
            eq(videos.id, input.id)
          )
        );  
      if (!existingVideo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (existingVideo.thumbnailKey) {
        const utapi = new UTApi();

        await utapi.deleteFiles(existingVideo.thumbnailKey);
        await db
          .update(videos)
          .set({ thumbnailKey: null, thumbnailUrl: null })
          .where(
            and(eq(videos.id, input.id), eq(videos.userId, userId))
          );
      }

      if (!existingVideo.muxPlaybackId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const utapi = new UTApi();

      const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`;
      const uploadedThumbnail = await utapi.uploadFilesFromUrl(tempThumbnailUrl);

      if (!uploadedThumbnail.data) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      const { key: thumbnailKey, ufsUrl: thumbnailUrl } = uploadedThumbnail.data;

      const [updatedVideo] = await db
        .update(videos)
        .set({
          thumbnailUrl,
          thumbnailKey,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(videos.userId, userId),
            eq(videos.id, input.id)
          )
        )
        .returning();
      
    return updatedVideo;
  }),
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
