import {
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema
} from "drizzle-zod";

import { timestamps } from "./columns.helpers";

export const reactionType = pgEnum("reaction_type", ["like", "dislike"]);

export const playlistVideos = pgTable(
  "playlist_videos",
  {
    playlistId: uuid("playlist_id")
      .references(() => playlists.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    ...timestamps
  },
  (t) => [
    primaryKey({
      name: "playlist_videos_pk",
      columns: [t.playlistId, t.videoId]
    })
  ]
);

export const playlists = pgTable("playlists", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  ...timestamps
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: varchar("clerk_id", { length: 255 }).unique().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    bannerUrl: text("banner_url"),
    bannerKey: text("banner_key"),
    imageUrl: varchar("image_url", { length: 255 }).notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    viewerId: uuid("viewer_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    creatorId: uuid("creator_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    ...timestamps
  },
  (t) => [
    primaryKey({
      name: "subscriptions_pk",
      columns: [t.viewerId, t.creatorId]
    })
  ]
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).unique().notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex("name_idx").on(t.name)]
);

export const videoVisibility = pgEnum("video_visibility", [
  "public",
  "private"
]);

export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  muxStatus: text("mux_status"),
  muxAssetId: text("mux_asset_id").unique(),
  muxUploadId: text("mux_upload_id").unique(),
  muxPlaybackId: text("mux_playback_id").unique(),
  muxTrackId: text("mux_track_id").unique(),
  muxTrackStatus: text("mux_track_status"),
  thumbnailKey: text("thumbnail_key"),
  thumbnailUrl: varchar("thumbnail_url", { length: 255 }),
  previewUrl: varchar("preview_url", { length: 255 }),
  previewKey: text("preview_key"),
  duration: integer("duration").default(0).notNull(),
  visibility: videoVisibility("visibility").default("private").notNull(),
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade"
    })
    .notNull(),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null"
  }),
  ...timestamps
});

export const videoSelectSchema = createSelectSchema(videos);
export const videoInsertSchema = createInsertSchema(videos);
export const videoUpdateSchema = createUpdateSchema(videos);

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    parentId: uuid("parent_id"),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    value: text("value").notNull(),
    ...timestamps
  },
  (t) => {
    return [
      foreignKey({
        columns: [t.parentId],
        foreignColumns: [t.id],
        name: "comments_parent_id_fkey"
      }).onDelete("cascade")
    ];
  }
);

export const commentSelectSchema = createSelectSchema(comments);
export const commentInsertSchema = createInsertSchema(comments);
export const commentUpdateSchema = createUpdateSchema(comments);

export const commentReactions = pgTable(
  "comment_reactions",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    commentId: uuid("comment_id")
      .references(() => comments.id, { onDelete: "cascade" })
      .notNull(),
    type: reactionType("type").notNull(),
    ...timestamps
  },
  (t) => [
    primaryKey({
      name: "comment_reactions_pk",
      columns: [t.userId, t.commentId]
    })
  ]
);

export const videoViews = pgTable(
  "video_views",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    ...timestamps
  },
  (t) => [
    primaryKey({
      name: "video_views_pk",
      columns: [t.userId, t.videoId]
    })
  ]
);

export const videoViewSelectSchema = createSelectSchema(videoViews);
export const videoViewInsertSchema = createInsertSchema(videoViews);
export const videoViewUpdateSchema = createUpdateSchema(videoViews);

export const videoReactions = pgTable(
  "video_reactions",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    type: reactionType("type").notNull(),
    ...timestamps
  },
  (t) => [
    primaryKey({
      name: "video_reactions_pk",
      columns: [t.userId, t.videoId]
    })
  ]
);

export const videoReactionSelectSchema = createSelectSchema(videoReactions);
export const videoReactionInsertSchema = createInsertSchema(videoReactions);
export const videoReactionUpdateSchema = createUpdateSchema(videoReactions);
