import { Hono } from "hono";
import { Context } from "@/utils/env";

export const createApp = () => new Hono<Context>();
