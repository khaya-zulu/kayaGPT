import { generateObject } from "ai";
import { z } from "zod";

import { schema, db, desc, eq, sql } from "@kgpt/db";

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

    await db(env.DB).insert(schema.chat).values({
      id,
      title: object.title,
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
};

export const getChatHistory = async (env: Env) => {
  try {
    const chatMessagesSubquery = db(env.DB)
      .select({
        chatId: schema.chatMessage.chatId,
        content: schema.chatMessage.content,
        createdAt: schema.chatMessage.createdAt,
      })
      .from(schema.chatMessage)
      .groupBy(schema.chatMessage.chatId)
      .orderBy(desc(schema.chatMessage.createdAt))
      .as("chatMessagesSubquery");

    const chats = await db(env.DB)
      .select({
        id: schema.chat.id,
        title: schema.chat.title,
        lastMessage: {
          content: chatMessagesSubquery.content,
          createdAt: chatMessagesSubquery.createdAt,
        },
      })
      .from(schema.chat)
      .leftJoin(
        chatMessagesSubquery,
        eq(chatMessagesSubquery.chatId, schema.chat.id)
      );

    return chats;
  } catch (error) {
    console.error("Error getting chat history:", error);
    throw error;
  }
};

export const getChatTitleById = async (env: Env, props: { chatId: string }) => {
  try {
    const [chatTitle] = await db(env.DB)
      .select({
        title: schema.chat.title,
      })
      .from(schema.chat)
      .where(eq(schema.chat.id, props.chatId));

    if (!chatTitle) {
      throw new Error(`Chat with ID ${props.chatId} not found`);
    }

    return chatTitle;
  } catch (error) {
    console.error("Error getting chat title by ID:", error);
    throw error;
  }
};
