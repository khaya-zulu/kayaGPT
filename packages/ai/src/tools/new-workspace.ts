import { tool } from "ai";
import { z } from "zod";

const inputSchema = z.object({
  prompt: z
    .string()
    .describe(
      "Generation instructions for the image. Keep it short and concise."
    ),
});

const outputSchema = z.object({
  workspaceKey: z.string().optional(),
  prompt: z.string(),
});

export type NewWorkspaceToolInput = z.infer<typeof inputSchema>;
export type NewWorkspaceToolOutput = z.infer<typeof outputSchema>;

export const createNewWorkspaceTool = (
  execute: (input: NewWorkspaceToolInput) => Promise<NewWorkspaceToolOutput>
) => {
  return tool({
    description: "Generates an image from a prompt",
    parameters: inputSchema,
    execute,
  });
};
