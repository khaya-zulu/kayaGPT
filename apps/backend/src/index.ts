import { Hono } from "hono";
import { cors } from "hono/cors";

import { chatRoute } from "./routes/chat";

import { app as appServer } from "@/utils/server";

appServer.use("/api/*", cors());

const routes = appServer.route("/api/chat", chatRoute);

export default appServer;

export type AppType = typeof routes;
