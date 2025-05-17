import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { id } from "./utils";

export const user = sqliteTable("user", {
  id,
  username: text("username").notNull(),
  displayName: text("name").notNull(),
  email: text("email").unique(),
  description: text("description").default(""),
  colorSettings: text("settings", { mode: "json" })
    .$type<{ 50: string; 100: string; 200: string }>()
    .default({
      50: "#fafafa",
      100: "#f4f4f5",
      200: "#e4e4e7",
    }),
  social: text("social")
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
