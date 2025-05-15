import { text } from "drizzle-orm/sqlite-core";

export const dateNow = (name: string) =>
  text(name).$defaultFn(() => new Date().toString());

export const id = text("id").primaryKey();
