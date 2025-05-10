import { Env } from "@/utils/env";
import { chatMessage, db, InferSelectModel } from "@kgpt/db";

type ChatMessageSelect = InferSelectModel<typeof chatMessage>;

export const createChatMessage = async (
  env: Env,
  props: { chatId: string; content: string; role: ChatMessageSelect["role"] }
) => {
  try {
    const [newMessage] = await db(env.DB)
      .insert(chatMessage)
      .values(props)
      .returning({ id: chatMessage.id });

    return newMessage;
  } catch (error) {
    console.error("Error creating chat message:", error);
    throw error;
  }
};
