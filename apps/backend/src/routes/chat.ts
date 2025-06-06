import { Message } from "ai";

import {
  deleteChatById,
  getChatHistory,
  getChatTitleById,
} from "@/queries/chat";
import { getChatMessagesByChatId } from "@/queries/chat-message";

import { createOpenAIModel } from "@/utils/models";
import { createApp } from "@/utils/server";
import { privateAuth } from "@/utils/auth";
import { generateChatTitleService } from "@/services/generate-chat-title";
import { saveLastMessageService } from "@/services/save-last-message";
import { getUserOnboardedAtById } from "@/queries/user";
import { generalChatStreamText } from "@/services/general-chat-stream-text";
import { onboardingChatStreamText } from "@/services/onboarding-chat-stream-text";
import { isObjectExists } from "@/utils/r2";

export const chatRoute = createApp()
  .get("/", privateAuth, async (c) => {
    const chats = await getChatHistory(c.env);
    return c.json({ chats });
  })
  .post("/:chatId/delete", privateAuth, async (c) => {
    await deleteChatById(c.env, {
      chatId: c.req.param("chatId"),
    });

    return c.json({ success: true });
  })
  .get("/:chatId/title", privateAuth, async (c) => {
    const chatId = c.req.param("chatId");

    const chat = await getChatTitleById(c.env, { chatId });
    return c.json({ chat });
  })
  .get("/:chatId/messages", privateAuth, async (c) => {
    const chatId = c.req.param("chatId");
    const messages = await getChatMessagesByChatId(c.env, { chatId });

    return c.json({ messages });
  })
  .post("/:chatId", privateAuth, async (c) => {
    const userId = c.get("userId");

    const body = await c.req.json<{ messages: Message[] }>();
    const chatId = c.req.param("chatId");

    const openai = await createOpenAIModel(c.env, ["gpt-4o-mini"]);

    const isNewMessage = body.messages.length === 1;

    if (isNewMessage) {
      await generateChatTitleService(c.env, {
        prompt: body.messages[0].content,
        chatId,
        userId,
        model: openai,
      });
    }

    const user = await getUserOnboardedAtById(c.env, { userId });
    const isOnboardingComplete = !!user.onboardedAt;

    const isTheFirstMessage = body.messages.length === 1;

    // do not save the first message for onboarding chats
    if (!isTheFirstMessage && !isOnboardingComplete) {
      await saveLastMessageService(c.env, { chatId, messages: body.messages });
    }

    if (!isOnboardingComplete) {
      const isAvatarUploaded = isObjectExists(c.env.R2_PROFILE, userId);
      const isWorkspaceUploaded = isObjectExists(c.env.R2_WORKSPACE, userId);

      return onboardingChatStreamText(c.env, {
        model: openai,
        messages: body.messages,
        userId,
        chatId,
      });
    }

    return generalChatStreamText(c.env, {
      model: openai,
      messages: body.messages,
      userId,
      chatId,
    });
  });
