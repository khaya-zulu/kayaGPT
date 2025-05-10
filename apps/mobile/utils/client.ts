import { type AppType } from "@kgpt/backend";
import { hc } from "hono/client";

export const client = hc<AppType>("http://localhost:8787/");
