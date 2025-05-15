import { Hono } from "hono";
import { Context } from "@/utils/env";

export const app = new Hono<Context>();
