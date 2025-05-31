import { tool } from "ai";
import { z } from "zod";

export const profileSettingsTool = () => {
  return tool({
    description: `Opens the user's profile settings editor. There's 3 tabs:
    - General: Change your username, display name, and region (part of the world you are in).
    - Description: Edit your user description. This almost a bio, as it is publicly visible.
    - Social: Add your social links, Github, Twitter, Linkedin, and website.`,
    parameters: z.object({ tab: z.enum(["general", "description", "social"]) }),
    execute: async (params) => params,
  });
};
