import { Env } from "@/utils/env";
import { db, eq, schema } from "@kgpt/db";
import { createId } from "@paralleldrive/cuid2";

export const findOrCreateUser = async (env: Env, props: { email: string }) => {
  try {
    const [user] = await db(env.DB)
      .select({ id: schema.user.id })
      .from(schema.user)
      .where(eq(schema.user.email, props.email));

    if (user) {
      return user;
    } else {
      const id = createId();

      const [newUser] = await db(env.DB)
        .insert(schema.user)
        .values({
          email: props.email,
          id,
          displayName: "",
          username: "",
        })
        .returning();

      return newUser;
    }
  } catch (error: any) {
    console.error("Error finding or creating user:", error.message);
    throw new Error("Failed to find or create user");
  }
};

export const getUserById = async (env: Env, props: { id: string }) => {
  try {
    const [user] = await db(env.DB)
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, props.id));

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Failed to fetch user");
  }
};

export const updateUserById = async (
  env: Env,
  props: { id: string; description: string; displayName: string }
) => {
  try {
    await db(env.DB)
      .update(schema.user)
      .set({
        description: props.description,
        displayName: props.displayName,
      })
      .where(eq(schema.user.id, props.id));
  } catch (error: any) {
    console.error("Error updating user by ID:", error.message);
    throw new Error("Failed to update user");
  }
};

export const getUserDescriptionById = async (
  env: Env,
  props: { userId: string }
) => {
  try {
    const [user] = await db(env.DB)
      .select({
        description: schema.user.description,
      })
      .from(schema.user)
      .where(eq(schema.user.id, props.userId));

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error: any) {
    console.error("Error fetching user description by ID:", error.message);
    throw new Error("Failed to fetch user description");
  }
};
