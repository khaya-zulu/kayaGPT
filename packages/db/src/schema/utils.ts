import { text, integer } from "drizzle-orm/sqlite-core";

export const dateNow = (name: string) =>
  integer(name, { mode: "timestamp" }).$defaultFn(() => new Date());

export const id = text("id").primaryKey();
