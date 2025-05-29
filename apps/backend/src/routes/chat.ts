import { streamText, Message, generateObject, tool } from "ai";

import {
  createChat,
  deleteChatById,
  getChatHistory,
  getChatTitleById,
} from "@/queries/chat";
import {
  createChatMessage,
  getChatMessagesByChatId,
} from "@/queries/chat-message";

import { createOpenAIModel } from "@/utils/models";
import { createApp } from "@/utils/server";
import { z } from "zod";
import { privateAuth } from "@/utils/auth";
import { generateWorkspaceTool } from "@/services/tools/generate-workspace";

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
      const startingPrompt = body.messages[0].content;

      const { object } = await generateObject({
        model: await createOpenAIModel(c.env, ["gpt-4o-mini"]),
        schema: z.object({
          title: z.string(),
        }),
        system:
          "Generate a short title that summarizes a prompt. The title should be short and concise.",
        prompt: startingPrompt,
      });

      await createChat(c.env, {
        prompt: startingPrompt,
        id: chatId,
        title: object.title,
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
      tools: {
        generateWorkspace: generateWorkspaceTool(c.env, { userId }),
        description: tool({
          description: "open the user description editor",
          parameters: z.object({}),
          execute: async () => {
            return { isOpening: true };
          },
        }),
      },
      maxSteps: 4,
      system:
        "You are a helpful personal assitant, for my personal website. You are meant to help the user be more productive. Be friendly and concise. For tools where an image key is returned, the image will be displayed in the chat, please don't give the key in your message.",
      onFinish: async (message) => {
        const toolResults = message.steps
          .map((step) => step.toolResults)
          .flat();

        await createChatMessage(c.env, {
          chatId,
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
  });
