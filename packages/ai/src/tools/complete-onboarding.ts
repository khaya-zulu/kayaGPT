import { tool } from "ai";
import { z } from "zod";

const inputSchema = z.object({});

const outputSchema = z.object({
  isOnboardingComplete: z.literal(true),
  username: z.string(),
});

export type CompleteOnboardingToolInput = z.infer<typeof inputSchema>;
export type CompleteOnboardingToolOutput = z.infer<typeof outputSchema>;

export const createCompleteOnboardingTool = (
  execute: (
    input: CompleteOnboardingToolInput
  ) => Promise<CompleteOnboardingToolOutput>
) => {
  return tool({
    description: "Completes the onboarding process for the user.",
    parameters: inputSchema,
    execute,
  });
};
