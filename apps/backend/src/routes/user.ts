import { z } from "zod";
import { Message, streamText, tool } from "ai";

import {
  getUserById,
  getUserDescriptionById,
  updateUserById,
} from "@/queries/user";

import { createApp } from "@/utils/server";
import { privateAuth } from "@/utils/auth";
import { createOpenAIModel } from "@/utils/models";

import { zValidator } from "@hono/zod-validator";

import { generateWorkspaceTool } from "@/services/tools/generate-workspace";

export const userRoute = createApp()
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
  .post(
    "bio/use-workspace",
    privateAuth,
    zValidator(
      "query",
      z.object({
        key: z.string(),
      })
    ),
    async (c) => {
      const query = c.req.valid("query");
      const workspace = await c.env.WORKSPACE.get(query.key);

      if (!workspace) {
        return c.json({ success: false });
      }

      const userId = c.get("userId");
      await c.env.WORKSPACE.put(userId, workspace.body);

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
        `You generate personalized workspace images using a reference and a short prompt. Keep the final prompt concise and focused (20 words max). Return only the prompt used.
Here is information about the user:` +
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
