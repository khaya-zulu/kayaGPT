import { z } from "zod";
import { Message, streamText, tool } from "ai";

import {
  getUserById,
  getUserByUsername,
  getUserDescriptionById,
  getUserSettingsById,
  updateUserById,
  updateUserSettingsById,
} from "@/queries/user";

import { createApp } from "@/utils/server";
import { privateAuth } from "@/utils/auth";
import { createOpenAIModel } from "@/utils/models";

import { zValidator } from "@hono/zod-validator";

import { generateWorkspaceTool } from "@/services/tools/generate-workspace";
import { downloadImage } from "@/services/download-image";
import { calculateShade, calculateTint } from "@/utils/color";

export const userRoute = createApp()
  .get("/overview/:username", async (c) => {
    const username = c.req.param("username");
    const user = await getUserByUsername(c.env, { username });

    return c.json(user);
  })
  .get("/settings", privateAuth, async (c) => {
    const userId = c.get("userId");
    const user = await getUserSettingsById(c.env, { userId });

    return c.json(user);
  })
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
      z.object({
        description: z.string(),
        displayName: z.string(),
        username: z.string(),
      })
    ),
    async (c) => {
      const userId = c.get("userId");

      const { description, displayName, username } = c.req.valid("json");

      await updateUserById(c.env, {
        id: userId,
        displayName,
        description,
        username,
      });

      return c.json({ success: true });
    }
  )
  .post(
    "bio/use-workspace",
    privateAuth,
    zValidator(
      "json",
      z.object({
        key: z.string(),
        color: z.string(),
      })
    ),
    async (c) => {
      const body = c.req.valid("json");
      const workspace = await c.env.R2_WORKSPACE.get(body.key);

      if (!workspace) {
        return c.json({ success: false });
      }

      const userId = c.get("userId");
      await c.env.R2_WORKSPACE.put(userId, workspace.body);

      await updateUserSettingsById(c.env, {
        userId,
        colorSettings: {
          "50": calculateTint({ hexColor: body.color, percentage: 0.95 }),
          "100": calculateTint({ hexColor: body.color, percentage: 0.9 }),
          "200": calculateTint({ hexColor: body.color, percentage: 0.8 }),
          "300": calculateTint({ hexColor: body.color, percentage: 0.6 }),
          "400": calculateTint({ hexColor: body.color, percentage: 0.3 }),
          base: body.color, // base color is 500
          "600": calculateShade({ hexColor: body.color, percentage: 0.1 }),
          "700": calculateShade({ hexColor: body.color, percentage: 0.2 }),
          "800": calculateShade({ hexColor: body.color, percentage: 0.35 }),
          "900": calculateShade({ hexColor: body.color, percentage: 0.5 }),
        },
      });

      return c.json({ success: true });
    }
  )
  .post("/profile/upload", privateAuth, async (c) => {
    const userId = c.get("userId");
    const body = await c.req.parseBody();

    await c.env.R2_PROFILE.put(userId, body["file"]);

    return c.json({ success: true });
  })
  .get("/profile/:key", privateAuth, async (c) => {
    const userId = c.get("userId");
    return downloadImage(c, c.env.R2_PROFILE, { key: userId });
  })
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
