import OpenAI from "openai";
import { Env } from "./env";

export const openaiClient = (env: Env) => {
  return new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });
};
