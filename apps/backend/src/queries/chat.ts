import { generateObject } from "ai";
import { z } from "zod";

import { chat, db } from "@kgpt/db";

import { createOpenAIModel } from "@/utils/models";
import { Env } from "@/types/env";

export const createChat = async ({
  prompt,
  id,
  env,
}: {
  prompt: string;
  id: string;
  env: Env;
}) => {
  const { object } = await generateObject({
    model: await createOpenAIModel(env, ["gpt-4o-mini"]),
    schema: z.object({
      title: z.string(),
    }),
    system: "Generate a title for a message app based on the prompt",
    prompt,
  });

  await db(env.DB).insert(chat).values({
    id,
    title: object.title,
  });
};
