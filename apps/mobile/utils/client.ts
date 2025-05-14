import { type AppType } from "@kgpt/backend";
import { hc } from "hono/client";

export const client = hc<AppType>("http://localhost:8787/", {
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
