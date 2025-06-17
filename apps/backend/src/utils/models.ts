import { createOpenAI, OpenAIProvider } from "@ai-sdk/openai";
import { createWorkersAI, WorkersAI } from "workers-ai-provider";

import { Env } from "@/utils/env";

export const createOpenAIModel = async (
  env: Env,
  opts: Parameters<OpenAIProvider>
) => {
  const model = await createOpenAI({
    apiKey: env.OPENAI_API_KEY,
  });

  return model(...opts);
};

export const createWorkersAIModel = async (
  env: Env,
  modelId: Parameters<WorkersAI>[0]
) => {
  const workersai = createWorkersAI({
    binding: env.AI,
  });

  return workersai(modelId);
};
