import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { dateNow, id } from "./utils";

export const chat = sqliteTable("chat", {
  id: text("id").notNull(),
  title: text("text").notNull(),
  updatedAt: dateNow("updated_at"),
  createdAt: dateNow("created_at"),
});

export const chatMessage = sqliteTable("chat_message", {
  id,
  content: text("content").notNull(),
  role: text("role").notNull().$type<"user" | "assistant">(),
  chatId: int("chat_id").notNull(),
});
