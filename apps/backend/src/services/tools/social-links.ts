import { getUserSocialLinksById } from "@/queries/user";
import { Env } from "@/utils/env";
import { tool } from "ai";
import { z } from "zod";

export const socialLinksTool = (env: Env, props: { userId: string }) => {
  return tool({
    description:
      "Fetches a user's social media links. If the user is requesting an action related to editing the links, a form will be displayed.",
    parameters: z.object({
      isEditable: z
        .boolean()
        .describe(
          "Whether the app should display an edit form for the social links."
        ),
    }),
    execute: async ({ isEditable }) => {
      const { socialLinks } = await getUserSocialLinksById(env, {
        userId: props.userId,
      });

      return {
        socialLinks,
        isEditable,
      };
    },
  });
};
