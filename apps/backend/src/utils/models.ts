import {
  createOpenAI,
  OpenAIProvider,
  OpenAIProviderSettings,
} from "@ai-sdk/openai";

import { Env } from "@/types/env";

export const createOpenAIModel = async (
  env: Env,
  opts: Parameters<OpenAIProvider>
) => {
  const model = await createOpenAI({
    apiKey: env.OPENAI_API_KEY,
  });

  return model(...opts);
};
