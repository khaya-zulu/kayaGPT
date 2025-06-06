import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

import { dateNow, id } from "./utils";

export const chat = sqliteTable("chat", {
  id,
  title: text("text").notNull(),
  updatedAt: dateNow("updated_at"),
  createdAt: dateNow("created_at"),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  userId: text("user_id").notNull(),
});

type Tool = {
  toolId: string;
  toolName: string;
  result?: Record<string, any>;
};

export const chatMessage = sqliteTable("chat_message", {
  id,
  content: text("content").notNull(),
  role: text("role").notNull().$type<"user" | "assistant">(),
  chatId: text("chat_id").notNull(),
  createdAt: dateNow("created_at"),
  tools: text("tools", { mode: "json" }).$type<Tool[]>().default([]),
});
