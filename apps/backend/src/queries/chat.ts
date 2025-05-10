import { generateObject } from "ai";
import { z } from "zod";

import { chat, chatMessage, db, desc, eq, sql } from "@kgpt/db";

import { createOpenAIModel } from "@/utils/models";
import { Env } from "@/utils/env";

export const createChat = async ({
  prompt,
  id,
  env,
}: {
  prompt: string;
  id: string;
  env: Env;
}) => {
  try {
    const { object } = await generateObject({
      model: await createOpenAIModel(env, ["gpt-4o-mini"]),
      schema: z.object({
        title: z.string(),
      }),
      system: "Generate a title for a message app based on the prompt",
      prompt,
    });

    await db(env.DB).insert(chat).values({
      id,
      title: object.title,
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
};

export const getChatHistory = async ({ env }: { env: Env }) => {
  try {
    const chatMessagesSubquery = db(env.DB)
      .select({
        chatId: chatMessage.chatId,
        content: chatMessage.content,
        createdAt: chatMessage.createdAt,
      })
      .from(chatMessage)
      .groupBy(chatMessage.chatId)
      .orderBy(desc(chatMessage.createdAt))
      .as("chatMessagesSubquery");

    const chats = await db(env.DB)
      .select({
        id: chat.id,
        title: chat.title,
        lastMessage: {
          content: chatMessagesSubquery.content,
          createdAt: chatMessagesSubquery.createdAt,
        },
      })
      .from(chat)
      .leftJoin(chatMessagesSubquery, eq(chatMessagesSubquery.chatId, chat.id));

    return chats;
  } catch (error) {
    console.error("Error getting chat history:", error);
    throw error;
  }
};
