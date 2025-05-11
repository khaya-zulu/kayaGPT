import { AnyD1Database, drizzle } from "drizzle-orm/d1";
export * from "drizzle-orm";

export * as schema from "./schema";

export const db = (db: AnyD1Database) => {
  return drizzle(db);
};
