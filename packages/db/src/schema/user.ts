import { blob, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").unique().notNull(),
  username: text("username").notNull(),
  displayName: text("name").notNull(),
  social: blob("social")
    .$type<{
      github?: string;
      x?: string;
      website?: string;
      linkedin?: string;
    }>()
    .default({
      github: "",
      x: "",
      website: "",
      linkedin: "",
    }),
});
