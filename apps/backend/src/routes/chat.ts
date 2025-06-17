import { Message } from "ai";

import {
  deleteChatById,
  getChatHistoryByUserId,
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

export const chatRoute = createApp()
  .get("/", privateAuth, async (c) => {
    const userId = c.get("userId");

    const chats = await getChatHistoryByUserId(c.env, { userId });
    return c.json({ chats });
  })
  .post("/:chatId/delete", privateAuth, async (c) => {
    const userId = c.get("userId");

    await deleteChatById(c.env, {
      chatId: c.req.param("chatId"),
      userId,
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
    const userId = c.get("userId");

    const messages = await getChatMessagesByChatId(c.env, { chatId, userId });

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
    if (isOnboardingComplete || !isTheFirstMessage) {
      await saveLastMessageService(c.env, { chatId, messages: body.messages });
    }

    const model = await createOpenAIModel(c.env, ["gpt-4.1-2025-04-14"]);

    if (!isOnboardingComplete) {
      return onboardingChatStreamText(c.env, {
        model,
        messages: body.messages,
        userId,
        chatId,
      });
    }

    return generalChatStreamText(c.env, {
      model,
      messages: body.messages,
      userId,
      chatId,
    });
  });
