import { createChat, getChatHistory } from "@/queries/chat";
import { createChatMessage } from "@/queries/chat-message";

import { createOpenAIModel } from "@/utils/models";
import { streamText, Message } from "ai";
import { app } from "@/utils/server";

export const chatRoute = app
  .get("/", async (c) => {
    const chats = await getChatHistory({ env: c.env });
    return c.json({ chats });
  })
  .post("/:chatId", async (c) => {
    const body = await c.req.json<{ messages: Message[] }>();
    const chatId = c.req.param("chatId");

    const openai = await createOpenAIModel(c.env, ["gpt-4o-mini"]);

    const isNewMessage = body.messages.length === 1;

    if (isNewMessage) {
      await createChat({
        prompt: body.messages[0].content,
        id: chatId,
        env: c.env,
      });
    } else {
      const lastMessage = body.messages.at(-1);

      if (lastMessage) {
        await createChatMessage(c.env, {
          chatId,
          content: lastMessage.content,
          role: "user",
        });
      }
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
