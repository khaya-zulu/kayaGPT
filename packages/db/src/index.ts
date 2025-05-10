import { AnyD1Database, drizzle } from "drizzle-orm/d1";

export * from "./schema";

export const db = (db: AnyD1Database) => {
  return drizzle(db);
};
