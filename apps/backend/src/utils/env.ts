export type Env = {
  OPENAI_API_KEY: string;
  DB: D1Database;
  WORKSPACE: R2Bucket;
};

export type Context = {
  Bindings: Env;
  Variables: { userEmail?: string; userId: string };
};
