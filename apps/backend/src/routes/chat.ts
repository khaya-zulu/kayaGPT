import { streamText, Message } from "ai";

import { createChat, getChatHistory, getChatTitleById } from "@/queries/chat";
import {
  createChatMessage,
  getChatMessagesByChatId,
} from "@/queries/chat-message";

import { createOpenAIModel } from "@/utils/models";
import { app } from "@/utils/server";

export const chatRoute = app
  .get("/", async (c) => {
    const chats = await getChatHistory(c.env);
    return c.json({ chats });
  })
  .get("/:chatId/title", async (c) => {
    const chatId = c.req.param("chatId");

    const chat = await getChatTitleById(c.env, { chatId });
    return c.json({ chat });
  })
  .get("/:chatId/messages", async (c) => {
    const chatId = c.req.param("chatId");
    const messages = await getChatMessagesByChatId(c.env, { chatId });

    return c.json({ messages });
  })
  .post("/:chatId", async (c) => {
    const body = await c.req.json<{ messages: Message[] }>();
    const chatId = c.req.param("chatId");

    const openai = await createOpenAIModel(c.env, ["gpt-4o-mini"]);

    const isNewMessage = body.messages.length === 1;

    if (isNewMessage) {
      await createChat({
        prompt: body.messages[0].content,
        env: c.env,
        id: chatId,
      });
    }

    const lastMessage = body.messages.at(-1);

    if (lastMessage) {
      await createChatMessage(c.env, {
        chatId,
        content: lastMessage.content,
        role: "user",
      });
    }

    const result = streamText({
      model: openai,
      messages: body.messages,
      onError: console.error,
      onFinish: async (message) => {
        await createChatMessage(c.env, {
          chatId,
          content: message.text,
          role: "assistant",
        });
      },
    });

    return result.toDataStreamResponse();
  });
