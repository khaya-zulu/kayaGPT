import { tool } from "ai";

import { Env } from "@/utils/env";

import { z } from "zod";
import { updateUsernameAndDisplayNameById } from "@/queries/user";

export const saveDisplayNameTool = (env: Env, props: { userId: string }) => {
  return tool({
    description:
      "Saves the user's display name to the database and generates username based on it.",
    parameters: z.object({
      displayName: z
        .string()
        .describe("The display name to save for the user."),
      username: z.string().describe("The username to save for the user."),
    }),
    execute: async ({ displayName, username }) => {
      await updateUsernameAndDisplayNameById(env, {
        userId: props.userId,
        displayName,
        username,
      });

      return { displayName, username };
    },
  });
};
