import {
  integer,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core";

import { timestamps } from "./columns.helpers";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: varchar("clerk_id", { length: 255 }).unique().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    imageUrl: varchar("image_url", { length: 255 }).notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]
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
  thumbnailUrl: varchar("thumbnail_url", { length: 255 }),
  previewUrl: varchar("preview_url", { length: 255 }),
  duration: integer("duration"),
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
