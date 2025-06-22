import { createChat } from "@/queries/chat";
import { Env } from "@/utils/env";
import { generateObject, LanguageModelV1 } from "ai";
import { z } from "zod";

/**
 * generates a chat title based on a starting prompt
 * and creates a new chat.
 */
export const generateChatTitle = async (
  env: Env,
  props: {
    prompt: string;
    chatId: string;
    userId: string;
    model: LanguageModelV1;
  }
) => {
  const startingPrompt = props.prompt;

  const { object } = await generateObject({
    model: props.model,
    schema: z.object({
      title: z.string(),
    }),
    system:
      "Generate a short title that summarizes a prompt. The title should be short and concise.",
    prompt: startingPrompt,
  });

  await createChat(env, {
    id: props.chatId,
    title: object.title,
    userId: props.userId,
  });
};
