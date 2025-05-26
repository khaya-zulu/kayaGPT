import * as v from "valibot";

const envSchema = v.object({
  EXPO_PUBLIC_API_URL: v.string(),
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: v.string(),
});

export const processEnv = v.parse(envSchema, process.env);
