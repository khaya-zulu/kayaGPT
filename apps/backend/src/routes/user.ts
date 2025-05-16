import { z } from "zod";
import { Message, streamText, tool } from "ai";

import {
  getUserById,
  getUserDescriptionById,
  updateUserById,
} from "@/queries/user";

import { app } from "@/utils/server";
import { privateAuth } from "@/utils/auth";
import { createOpenAIModel } from "@/utils/models";

import { zValidator } from "@hono/zod-validator";

import { generateWorkspaceTool } from "@/services/tools/generate-workspace";

export const userRoute = app
  .get("/bio", privateAuth, async (c) => {
    const userId = c.get("userId");
    const user = await getUserById(c.env, { id: userId });

    return c.json(user);
  })
  .post(
    "/bio/update",
    privateAuth,
    zValidator(
      "json",
      z.object({ description: z.string(), displayName: z.string() })
    ),
    async (c) => {
      const userId = c.get("userId");

      const { description, displayName } = c.req.valid("json");

      await updateUserById(c.env, {
        id: userId,
        displayName,
        description,
      });

      return c.json({ success: true });
    }
  )
  .post("/workspace/generate", privateAuth, async (c) => {
    const userId = c.get("userId");

    const body = await c.req.json<{ messages: Message[] }>();

    const openai = await createOpenAIModel(c.env, ["gpt-4o-mini"]);

    const user = await getUserDescriptionById(c.env, { userId });

    const result = await streamText({
      system:
        "You are a helpful assistant that generates images for a workspace background. You will be provided with a reference image and a prompt. Use the reference image to generate an image that matches the prompt. Obviously, personalize the image to the user. As your answer return the prompt you used." +
        "Here is information about the user:" +
        "\n\n" +
        user.description,
      messages: body.messages,
      model: openai,
      tools: {
        generateImage: generateWorkspaceTool(c.env, { userId }),
      },
      toolChoice: "required",
    });

    return result.toDataStreamResponse();
  });
