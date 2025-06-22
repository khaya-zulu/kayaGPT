import { Context, Next } from "hono";
import { Context as ContextType } from "./env";
import { getAuth } from "@hono/clerk-auth";

import { findOrCreateUser } from "@/queries/user";
import { HTTPException } from "hono/http-exception";

const checkIfUserAllowed = (c: Context<ContextType>, email: string) => {
  // Allowed list check
  const allowedUserList = c.env.ALLOWED_LIST.split(",").map((email) =>
    email.trim()
  );

  const isFriendlyPath = c.req.path.startsWith("/api/user/settings");
  const isInAllowedList = allowedUserList.includes(email);

  if (isFriendlyPath || isInAllowedList) {
    return { isAllowed: isInAllowedList };
  }

  throw new HTTPException(403, { message: "Forbidden" });
};

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

  const { isAllowed } = checkIfUserAllowed(c, userEmail);

  const user = await findOrCreateUser(c.env, { email: userEmail });

  c.set("userEmail", userEmail);
  c.set("userId", user.id);
  c.set("isAllowed", isAllowed);

  await next();
};
