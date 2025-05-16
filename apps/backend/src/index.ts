import { cors } from "hono/cors";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { chatRoute } from "./routes/chat";
import { userRoute } from "./routes/user";

import { createApp } from "@/utils/server";
import { workspaceRoute } from "./routes/workspace";

const app = createApp();

app.use("/api/*", cors());
app.use("/api/*", clerkMiddleware());

const routes = app
  .route("/api/user", userRoute)
  .route("/api/chat", chatRoute)
  .route("/api/workspace", workspaceRoute);

export default routes;

export type AppType = typeof routes;
