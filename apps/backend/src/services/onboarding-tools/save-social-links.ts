import { updateSocialLinksById } from "@/queries/user";
import { Env } from "@/utils/env";
import { tool } from "ai";
import { z } from "zod";

const socialLinkSchema = z.string().url().optional();

export const saveSocialLinksTool = (env: Env, props: { userId: string }) => {
  return tool({
    description: "Saves the user's social links for onboarding.",
    parameters: z.object({
      github: socialLinkSchema.describe("The user's GitHub profile URL."),
      twitter: socialLinkSchema.describe("The user's Twitter profile URL."),
      linkedin: socialLinkSchema.describe("The user's LinkedIn profile URL."),
      website: socialLinkSchema.describe("The user's personal website URL."),
    }),
    execute: async ({ github, twitter, linkedin, website }) => {
      console.log(
        "Saving social links for user:",
        props.userId,
        github,
        twitter,
        linkedin,
        website
      );
      await updateSocialLinksById(env, {
        userId: props.userId,
        social: { github, x: twitter, linkedin, website },
      });
    },
  });
};
