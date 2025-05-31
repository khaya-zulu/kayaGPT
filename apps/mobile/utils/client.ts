import { type AppType } from "@kgpt/backend";
import { hc } from "hono/client";
import { processEnv } from "./env";

export const client = hc<AppType>(processEnv.EXPO_PUBLIC_API_URL, {
  headers: async () => {
    // @ts-expect-error: this is added globally by Clerk
    const token = await Clerk.session.getToken();

    return {
      Authorization: `Bearer ${token}`,
    };
  },
});

export type { InferRequestType, InferResponseType } from "hono/client";
