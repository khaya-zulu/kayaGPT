import { createChat, getChatHistory } from "@/queries/chat";
import { createOpenAIModel } from "@/utils/models";
import { streamText, Message } from "ai";
import { app } from "@/utils/server";

export const chatRoute = app
  .get("/", async (c) => {
    const chats = await getChatHistory({ env: c.env });
    return c.json({ chats });
  })
  .post("/:id", async (c) => {
    const body = await c.req.json<{ messages: Message[] }>();

    const openai = await createOpenAIModel(c.env, ["gpt-4o-mini"]);

    if (body.messages.length === 1) {
      await createChat({
        prompt: body.messages[0].content,
        id: c.req.param("id"),
        env: c.env,
      });
    }

    const result = streamText({
      model: openai,
      messages: body.messages,
      onError: console.error,
    });

    return result.toDataStreamResponse();
  });
