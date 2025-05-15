import { blob, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { id } from "./utils";

export const user = sqliteTable("user", {
  id,
  username: text("username").notNull(),
  displayName: text("name").notNull(),
  email: text("email").unique(),
  description: text("description").default(""),
  // social: blob("social")
  //   .$type<{
  //     github?: string;
  //     x?: string;
  //     website?: string;
  //     linkedin?: string;
  //   }>()
  //   .default({
  //     github: "",
  //     x: "",
  //     website: "",
  //     linkedin: "",
  //   }),
});
