import { Hono } from "hono";
import { Env } from "@/utils/env";

export const app = new Hono<{ Bindings: Env }>();
