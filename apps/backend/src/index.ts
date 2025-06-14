import { cors } from "hono/cors";
import { clerkMiddleware } from "@hono/clerk-auth";

import { chatRoute } from "./routes/chat";
import { userRoute } from "./routes/user";

import { createApp } from "@/utils/server";
import { workspaceRoute } from "./routes/workspace";
import { imgRoute } from "./routes/img";

const app = createApp();

app.use("/*", cors());
app.use("/*", clerkMiddleware());

const routes = app
  .route("/api/user", userRoute)
  .route("/api/chat", chatRoute)
  .route("/api/workspace", workspaceRoute)
  .route("/img", imgRoute)
  .get("/health", (c) => c.text("ok"));

export default routes;

export type AppType = typeof routes;
