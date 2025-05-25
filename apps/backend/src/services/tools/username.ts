import { getUsernameById } from "@/queries/user";
import { Env } from "@/utils/env";
import { tool } from "ai";
import { z } from "zod";

export const usernameTool = (env: Env, props: { userId: string }) => {
  return tool({
    description:
      "Fetches a user's username. If the user is requesting an action related to editing the username, a form will be displayed.",
    parameters: z.object({}),
    execute: async () => {
      const user = await getUsernameById(env, {
        userId: props.userId,
      });

      return {
        username: user.username,
      };
    },
  });
};
