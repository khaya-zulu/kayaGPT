import { tool } from "ai";
import { z } from "zod";

export const userAvatarTool = () => {
  return tool({
    description:
      "Shows the user's avatar inline. You can use this to see your current avatar or to change it.",
    parameters: z.object({}),
    execute: async () => {
      return { isVisible: true };
    },
  });
};
