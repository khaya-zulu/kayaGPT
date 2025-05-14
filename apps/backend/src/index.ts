import { cors } from "hono/cors";
import { clerkMiddleware } from "@hono/clerk-auth";

import { chatRoute } from "./routes/chat";

import { app as appServer } from "@/utils/server";

appServer.use("/api/*", cors());
appServer.use("/api/*", clerkMiddleware());

const routes = appServer.route("/api/chat", chatRoute);
export default appServer;

export type AppType = typeof routes;
