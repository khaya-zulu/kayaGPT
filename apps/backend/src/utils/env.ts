export type Env = {
  OPENAI_API_KEY: string;
  DB: D1Database;
};

export type Context = {
  Bindings: Env;
  Variables: { userEmail?: string; userId: string };
};
