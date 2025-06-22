import { tool } from "ai";
import { z } from "zod";

const inputSchema = z.object({
  tab: z.enum(["general", "description", "social"]),
});

const outputSchema = z.object({
  tab: z.enum(["general", "description", "social"]),
});

export type ProfileSettingsToolInput = z.infer<typeof inputSchema>;
export type ProfileSettingsToolOutput = z.infer<typeof outputSchema>;

export const createProfileSettingsTool = (
  execute: (
    input: ProfileSettingsToolInput
  ) => Promise<ProfileSettingsToolOutput>
) => {
  return tool({
    description: `Opens the user's profile settings editor. There's 3 tabs:
    - General: Change your username, display name, and region (part of the world you are in).
    - Description: Edit your user description. This almost a bio, as it is publicly visible.
    - Social: Add your social links, Github, Twitter, Linkedin, and website.`,
    parameters: inputSchema,
    execute,
  });
};
