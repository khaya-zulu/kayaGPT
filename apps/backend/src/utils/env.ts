export type Env = {
  OPENAI_API_KEY: string;
  OPEN_WEATHER_API_KEY: string;
  DB: D1Database;
  R2_WORKSPACE: R2Bucket;
  R2_PROFILE: R2Bucket;
  AI: Ai;
};

export type Context = {
  Bindings: Env;
  Variables: { userEmail?: string; userId: string };
};
