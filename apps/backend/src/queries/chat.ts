import { schema, db, desc, eq, asc, isNotNull, isNull } from "@kgpt/db";

import { Env } from "@/utils/env";

export const createChat = async (
  env: Env,
  {
    id,
    title,
  }: {
    prompt: string;
    id: string;
    title: string;
  }
) => {
  try {
    await db(env.DB).insert(schema.chat).values({
      id,
      title,
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
      .where(eq(schema.chatMessage.role, "assistant"))
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
      )
      .where(isNull(schema.chat.deletedAt));

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

export const deleteChatById = async (env: Env, props: { chatId: string }) => {
  try {
    await db(env.DB)
      .update(schema.chat)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(schema.chat.id, props.chatId));
  } catch (error: any) {
    console.error("Error deleting chat by ID:", error.message);
    throw error;
  }
};
