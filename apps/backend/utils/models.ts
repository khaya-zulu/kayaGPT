import { createOpenAI } from "@ai-sdk/openai";

import { Env } from "../types/env";

export const createOpenAIModel = (env: Env) => {
  return createOpenAI({
    apiKey: env.OPENAI_API_KEY,
  });
};
