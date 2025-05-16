import { cors } from "hono/cors";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { chatRoute } from "./routes/chat";
import { userRoute } from "./routes/user";

import { app as appServer } from "@/utils/server";
import { workspaceRoute } from "./routes/workspace";

appServer.use("/api/*", cors());
appServer.use("/api/*", clerkMiddleware());

const routes = appServer
  .route("/api/workspace", workspaceRoute)
  .route("/api/user", userRoute)
  .route("/api/chat", chatRoute);

export default appServer;

export type AppType = typeof routes;
