import { text, int } from "drizzle-orm/sqlite-core";

export const dateNow = (name: string) =>
  text(name).$defaultFn(() => new Date().toString());

export const id = int("id").primaryKey({ autoIncrement: true });
