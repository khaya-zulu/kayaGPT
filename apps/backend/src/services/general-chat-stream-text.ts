import { LanguageModelV1, Message, streamText } from "ai";

import { generateWorkspaceTool } from "@/services/tools/generate-workspace";
import { profileSettingsTool } from "@/services/tools/profile-settings";
import { userAvatarTool } from "@/services/tools/user-avatar";
import { Env } from "@/utils/env";
import { createChatMessage } from "@/queries/chat-message";

const GENERAL_CHAT_SYSTEM_PROMPT =
  "You’re a helpful, thoughtful assistant on KayaGPT—part friend, part productivity guide. Your job is to help each user feel more focused, more creative, and more at home. Be warm, friendly, and concise. If a tool returns an image, it will be shown in chat—no need to mention the key.";

/**
 * Streams text responses for the general chat. (Post onboarding)
 * will save the response to the chat.
 */
export const generalChatStreamText = async (
  env: Env,
  props: {
    model: LanguageModelV1;
    messages: Message[];
    userId: string;
    chatId: string;
  }
) => {
  const result = streamText({
    model: props.model,
    messages: props.messages,
    onError: console.error,
    tools: {
      newWorkspace: generateWorkspaceTool(env, { userId: props.userId }),
      profileSettings: profileSettingsTool(),
      userAvatar: userAvatarTool(),
    },
    maxSteps: 4,
    system: GENERAL_CHAT_SYSTEM_PROMPT,
    onFinish: async (message) => {
      const toolResults = message.steps.map((step) => step.toolResults).flat();

      await createChatMessage(env, {
        chatId: props.chatId,
        content: message.text,
        role: "assistant",
        tools: toolResults.map((t) => {
          return {
            toolId: t.toolCallId,
            toolName: t.toolName,
            result: t.result,
          };
        }),
      });
    },
  });

  return result.toDataStreamResponse();
};
