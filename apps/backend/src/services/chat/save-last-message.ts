import { createChatMessage } from "@/queries/chat-message";
import { Env } from "@/utils/env";
import { Message } from "ai";

/**
 * Saves the last message of a chat session.
 * This function is intended to be used after a chat session ends,
 * to store the last message in the database.
 */
export const saveLastMessage = async (
  env: Env,
  props: { chatId: string; messages: Message[] }
) => {
  const lastMessage = props.messages.at(-1);

  if (lastMessage) {
    await createChatMessage(env, {
      chatId: props.chatId,
      content: lastMessage.content,
      role: "user",
    });
  }
};
