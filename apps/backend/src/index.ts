import { Hono } from "hono";

import { cors } from "hono/cors";

import { Message, streamText } from "ai";
import { Env } from "../types/env";
import { createOpenAIModel } from "../utils/models";

const app = new Hono<{ Bindings: Env }>();

app.use("/api/*", cors());

app.post("/api/chat/:id", async (c) => {
  const body = await c.req.json<{ messages: Message[] }>();

  const openai = await createOpenAIModel(c.env);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages: body.messages,
    onError: console.error,
  });

  return result.toDataStreamResponse();
});

export default app;
