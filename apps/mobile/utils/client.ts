import { type AppType } from "@kgpt/backend";
import { hc } from "hono/client";
import { processEnv } from "./env";

export const client = hc<AppType>(processEnv.EXPO_PUBLIC_API_URL, {
  headers: async () => {
    // todo: does this work on mobile?
    // @ts-expect-error:
    const token = await Clerk.session.getToken();

    return {
      Authorization: `Bearer ${token}`,
    };
  },
});

export type { InferRequestType, InferResponseType } from "hono/client";
