import { Env } from "@/utils/env";
import { tool } from "ai";
import { z } from "zod";
import { generateRegionObjectService } from "../generate-region-object";
import { updateRegionById } from "@/queries/user";

export const saveRegionTool = (env: Env, props: { userId: string }) => {
  return tool({
    description: "Saves the user's region for onboarding.",
    parameters: z.object({
      regionName: z
        .string()
        .describe(
          "The name of the region the user is in, e.g., 'United States', 'Europe', etc."
        ),
    }),
    execute: async ({ regionName }) => {
      const region = await generateRegionObjectService(env, { regionName });
      await updateRegionById(env, { region, userId: props.userId });

      return region;
    },
  });
};
