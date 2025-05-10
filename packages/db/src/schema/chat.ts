import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { dateNow, id } from "./utils";

export const chat = sqliteTable("chat", {
  id: text("id").primaryKey(),
  name: int("name").notNull(),
  updatedAt: dateNow("updated_at").notNull(),
  createdAt: dateNow("created_at").notNull(),
});

export const chatMessage = sqliteTable("chat_message", {
  id,
  content: text("content").notNull(),
  role: text("role").notNull().$type<"user" | "assistant">(),
  chatId: int("chat_id").notNull(),
});
