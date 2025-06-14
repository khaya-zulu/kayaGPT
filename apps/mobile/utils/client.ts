import { type AppType } from "@kgpt/backend";
import { hc } from "hono/client";

export const client = hc<AppType>(process.env.EXPO_PUBLIC_API_URL, {
  headers: async () => {
    // @ts-ignore
    if (!Clerk.session) return;

    // @ts-expect-error: this is added globally by Clerk
    const token = await Clerk.session.getToken();

    return {
      Authorization: `Bearer ${token}`,
    };
  },
});

export type { InferRequestType, InferResponseType } from "hono/client";
