import {
  getUserById,
  getUsernameById,
  updateUserOnboardedAtById,
} from "@/queries/user";
import { Env } from "@/utils/env";
import { tool } from "ai";
import { z } from "zod";

export const completeOnboardingTool = (env: Env, props: { userId: string }) => {
  return tool({
    description: "Completes the onboarding process for the user.",
    parameters: z.object({}),
    execute: async () => {
      await updateUserOnboardedAtById(env, {
        userId: props.userId,
        onboardedAt: new Date(),
      });

      const user = await getUsernameById(env, { userId: props.userId });

      return { isOnboardingComplete: true, username: user.username };
    },
  });
};
