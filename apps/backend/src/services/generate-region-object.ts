import { Env } from "@/utils/env";
import { createOpenAIModel } from "@/utils/models";
import { generateObject } from "ai";
import { z } from "zod";

export const generateRegionObjectService = async (
  env: Env,
  props: { regionName: string }
) => {
  const model = await createOpenAIModel(env, ["gpt-4o"]);

  const response = await generateObject({
    model,
    schema: z.object({
      flag: z.string().describe("The emoji flag of the region"),
      lng: z.string().describe("The longitude of the region"),
      lat: z.string().describe("The latitude of the region"),
    }),
    prompt:
      "Return the emoji flag, longitude, and latitude of the region with the name: " +
      props.regionName,
  });

  return {
    ...response.object,
    name: props.regionName,
  };
};
