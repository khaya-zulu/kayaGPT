import { z } from "zod";

import {
  getUserById,
  getUserByUsername,
  getUserDescriptionById,
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
import { createOpenAIModel } from "@/utils/models";

import { zValidator } from "@hono/zod-validator";

import { downloadImage } from "@/services/download-image";
import { getColorPalette } from "@/utils/color";
import { createId } from "@paralleldrive/cuid2";
import { generateObject } from "ai";

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
        colorSettings: getColorPalette(body.color),
      });

      return c.json({ success: true });
    }
  )
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
        const model = await createOpenAIModel(c.env, ["gpt-4o"]);

        const response = await generateObject({
          model,
          schema: z.object({
            flag: z.string().describe("The emoji flag of the region"),
            lng: z.string().describe("The longitude of the region"),
            lat: z.string().describe("The latitude of the region"),
          }),
          prompt:
            "Return the emoji flag, longitude, and latitude of the region with the name: " +
            data.regionName,
        });

        region = {
          ...response.object,
          name: data.regionName,
        };
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
  .get("/profile/:key", privateAuth, async (c) => {
    const userId = c.get("userId");
    return downloadImage(c, c.env.R2_PROFILE, { key: userId });
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
  .get("/description/:username/:key", async (c) => {
    const username = c.req.param("username");
    const key = c.req.param("key");

    return downloadImage(c, c.env.R2_PROFILE, {
      key: `description/${username}/${key}`,
    });
  });
