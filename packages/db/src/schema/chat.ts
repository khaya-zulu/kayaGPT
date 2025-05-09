import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { dateNow, id } from ".";

export const chat = sqliteTable("chat", {
  id,
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
