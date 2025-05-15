import { app } from "@/utils/server";
import { privateAuth } from "@/utils/auth";
import { getUserById, updateUserById } from "@/queries/user";

import { zValidator } from "@hono/zod-validator";

import { z } from "zod";

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
  );
