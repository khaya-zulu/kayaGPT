import { text, integer } from "drizzle-orm/sqlite-core";

export const timeStamp = (name: string) => integer(name, { mode: "timestamp" });

export const dateNow = (name: string) =>
  timeStamp(name).$defaultFn(() => new Date());

export const id = text("id").primaryKey();
