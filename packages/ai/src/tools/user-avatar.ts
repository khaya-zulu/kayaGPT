import { tool } from "ai";
import { z } from "zod";

const inputSchema = z.object({});

const outputSchema = z.object({
  isVisible: z.literal(true),
});

export type UserAvatarToolInput = z.infer<typeof inputSchema>;
export type UserAvatarToolOutput = z.infer<typeof outputSchema>;

export const createUserAvatarTool = (
  execute: (input: UserAvatarToolInput) => Promise<UserAvatarToolOutput>
) => {
  return tool({
    description: `Shows the user's avatar inline. You can use this to see your current avatar or to change it.`,
    parameters: inputSchema,
    execute,
  });
};
