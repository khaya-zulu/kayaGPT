import { Env } from "@/utils/env";
import { schema, db, InferSelectModel, eq } from "@kgpt/db";
import { createId } from "@paralleldrive/cuid2";

type ChatMessageSelect = InferSelectModel<typeof schema.chatMessage>;

export const createChatMessage = async (
  env: Env,
  props: {
    chatId: string;
    content: string;
    role: ChatMessageSelect["role"];
  }
) => {
  try {
    const [newMessage] = await db(env.DB)
      .insert(schema.chatMessage)
      .values({
        ...props,
        id: createId(),
      })
      .returning({ id: schema.chatMessage.id });

    return newMessage;
  } catch (error) {
    console.error("Error creating chat message:", error);
    throw error;
  }
};

export const getChatMessagesByChatId = async (
  env: Env,
  props: { chatId: string }
) => {
  try {
    const chatMessages = await db(env.DB)
      .select({
        id: schema.chatMessage.id,
        content: schema.chatMessage.content,
        createdAt: schema.chatMessage.createdAt,
        role: schema.chatMessage.role,
      })
      .from(schema.chatMessage)
      .where(eq(schema.chatMessage.chatId, props.chatId));

    return chatMessages;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw error;
  }
};
