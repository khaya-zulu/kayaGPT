import { Context, Next } from "hono";
import { Context as ContextType } from "./env";
import { getAuth } from "@hono/clerk-auth";

import { findOrCreateUser } from "@/queries/user";
import { HTTPException } from "hono/http-exception";

export const privateAuth = async (c: Context<ContextType>, next: Next) => {
  const clerk = c.get("clerk");
  const auth = getAuth(c);

  if (!auth?.userId) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const authUser = await clerk.users.getUser(auth.userId);
  const userEmail = authUser.primaryEmailAddress?.emailAddress;

  if (!userEmail) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const user = await findOrCreateUser(c.env, { email: userEmail });

  c.set("userEmail", userEmail);
  c.set("userId", user.id);

  await next();
};
