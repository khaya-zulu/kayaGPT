import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { id } from "./utils";

export const user = sqliteTable("user", {
  id,
  username: text("username").notNull(),
  displayName: text("name").notNull(),
  email: text("email").unique(),
  description: text("description").default(""),
  region: text("region", { mode: "json" }).$type<{
    lng: string;
    lat: string;
    flag: string;
    name: string;
  }>(),
  colorSettings: text("settings", { mode: "json" })
    .$type<{
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      base: string;
      600: string;
      700: string;
      800: string;
      900: string;
    }>()
    .default({
      50: "#fafafa",
      100: "#f4f4f5",
      200: "#e4e4e7",
      300: "#d4d4d8",
      400: "#a1a1aa",
      base: "#71717a",
      600: "#52525b",
      700: "#3f3f46",
      800: "#27272a",
      900: "#18181b",
    }),
  social: text("social", { mode: "json" })
    .$type<{
      github?: string;
      x?: string;
      website?: string;
      linkedin?: string;
    }>()
    .default({
      github: "",
      x: "",
      website: "",
      linkedin: "",
    }),
});
