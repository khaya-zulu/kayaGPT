import { z } from "zod";

import {
  getUserRandom,
  getUserById,
  getUserByUsername,
  getUserDescriptionById,
  getUserDisplayNameById,
  getUserProfileById,
  getUserRegionById,
  getUserSettingsById,
  updateUserById,
  updateUserDescriptionById,
  updateUsernameById,
  updateUserProfileById,
  updateUserSettingsById,
} from "@/queries/user";

import { createApp } from "@/utils/server";
import { privateAuth } from "@/utils/auth";
import { createWorkersAIModel } from "@/utils/models";

import { zValidator } from "@hono/zod-validator";

import { getColorPalette } from "@/utils/color";
import { createId } from "@paralleldrive/cuid2";
import { generateText } from "ai";

import { getFirstChatByUserId } from "@/queries/chat";
import { generateRegionObject } from "@/services/utils/generate-region-object";
import { getUserWeather } from "@/services/utils/get-user-weather";

export const userRoute = createApp()
  .get("/overview/:username", async (c) => {
    const username = c.req.param("username");
    const user = await getUserByUsername(c.env, { username });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user);
  })
  .get("/settings", privateAuth, async (c) => {
    const userId = c.get("userId");
    const isAllowed = c.get("isAllowed");
    const user = await getUserSettingsById(c.env, { userId });

    let firstChatId: string | undefined;

    if (!user.onboardedAt) {
      // If the user is not onboarded, we can assume they have no chats yet.
      const firstChat = await getFirstChatByUserId(c.env, { userId });
      firstChatId = firstChat?.id;
    }

    return c.json({ ...user, firstChatId, userId: user.id, isAllowed });
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
        colorSettings: getColorPalette(body.color),
      });

      return c.json({ success: true });
    }
  )
  .get("/weather/:username", async (c) => {
    const username = c.req.param("username");
    const user = await getUserByUsername(c.env, { username });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const { weather, temp } = await getUserWeather(c.env, {
      userId: user.id,
    });

    return c.json(
      {
        temperature: temp,
        icon: weather.icon,
      },
      200
    );
  })
  .get("/weather", privateAuth, async (c) => {
    const userId = c.get("userId");

    const user = await getUserDisplayNameById(c.env, { userId });

    const { weather, temp } = await getUserWeather(c.env, { userId });

    const response = await generateText({
      model: await createWorkersAIModel(c.env, "@cf/meta/llama-3-8b-instruct"),
      prompt: `The temperature in ${weather.regionName} is ${temp}°C with a humidity of ${weather.humidity}%.`,
      system: `You are a helpful assistant that displays the current temperature and comments on the users current weather conditions in a friendly manner. Keep it very short and concise. Use emojis to make it more engaging. Use the user's first name.\n
      The user's name: ${user.displayName}\n
      Very important: The temperature (in celsius) must be in the response.`,
    });

    return c.json({
      // degrees in celsius
      temperature: temp,
      comment: response.text,
      regionName: weather.regionName,
      icon: weather.icon,
    });
  })
  .post(
    "/profile/username/exists",
    privateAuth,
    zValidator("json", z.object({ username: z.string() })),
    async (c) => {
      const body = c.req.valid("json");
      const user = await getUserByUsername(c.env, { username: body.username });

      return c.json({ exists: !!user && user.id !== c.get("userId") });
    }
  )
  .post(
    "/profile/username",
    privateAuth,
    zValidator("json", z.object({ username: z.string() })),
    async (c) => {
      const userId = c.get("userId");
      const body = c.req.valid("json");

      await updateUsernameById(c.env, {
        userId,
        username: body.username,
      });

      return c.json({ success: true });
    }
  )
  .get("/profile/description", privateAuth, async (c) => {
    const userId = c.get("userId");
    const user = await getUserDescriptionById(c.env, { userId });

    return c.json(user);
  })
  .post(
    "/profile/description",
    privateAuth,
    zValidator(
      "json",
      z.object({
        description: z.string(),
      })
    ),
    async (c) => {
      const userId = c.get("userId");
      const body = c.req.valid("json");

      await updateUserDescriptionById(c.env, {
        decription: body.description,
        userId,
      });

      return c.json({ success: true });
    }
  )
  .get("/profile/settings", privateAuth, async (c) => {
    const userId = c.get("userId");

    const user = await getUserProfileById(c.env, { userId });
    return c.json(user);
  })
  .post(
    "/profile/settings",
    privateAuth,
    zValidator(
      "json",
      z.object({
        description: z.string(),
        displayName: z.string(),
        username: z.string(),
        regionName: z.string(),
        social: z.object({
          github: z.string().optional(),
          linkedin: z.string().optional(),
          website: z.string().optional(),
          x: z.string().optional(),
        }),
      })
    ),
    async (c) => {
      const userId = c.get("userId");
      const data = c.req.valid("json");

      let region = await getUserRegionById(c.env, { userId });

      const { regionName, ...rest } = data;

      if (region?.name !== data.regionName) {
        region = await generateRegionObject(c.env, { regionName });
      }

      await updateUserProfileById(c.env, {
        userId,
        region,
        ...rest,
      });

      return c.json({ success: true });
    }
  )
  .post("/profile/description/upload", privateAuth, async (c) => {
    const userId = c.get("userId");
    const body = await c.req.parseBody();

    const id = createId();

    const key = `description/${userId}/${id}`;
    await c.env.R2_PROFILE.put(key, body["file"]);

    console.log("Uploaded description image:", key);

    return c.json({ key });
  })
  .post("/profile/upload", privateAuth, async (c) => {
    const userId = c.get("userId");
    const body = await c.req.parseBody();

    await c.env.R2_PROFILE.put(userId, body["file"]);

    return c.json({ success: true });
  })
  .post(
    "/workspace/color-palette",
    privateAuth,
    zValidator(
      "json",
      z.object({
        color: z.string(),
      })
    ),
    async (c) => {
      const userId = c.get("userId");
      const body = c.req.valid("json");

      await updateUserSettingsById(c.env, {
        colorSettings: getColorPalette(body.color),
        userId,
      });

      return c.json({ success: true });
    }
  )
  .get("/random", async (c) => {
    const user = await getUserRandom(c.env);

    if (!user) {
      return c.json({ error: "No users found" }, 404);
    }

    return c.json({
      username: user.username,
    });
  });
