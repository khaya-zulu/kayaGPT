import { Env } from "@/utils/env";
import { db, eq, schema, InferSelectModel } from "@kgpt/db";
import { createId } from "@paralleldrive/cuid2";

type UserSelect = InferSelectModel<typeof schema.user>;

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
      .select({
        id: schema.user.id,
        email: schema.user.email,
        displayName: schema.user.displayName,
        description: schema.user.description,
        username: schema.user.username,
      })
      .from(schema.user)
      .where(eq(schema.user.id, props.id));

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error: any) {
    console.error("Error fetching user by ID:", error.message);
    throw new Error("Failed to fetch user");
  }
};

export const getUserByUsername = async (
  env: Env,
  props: { username: string }
) => {
  try {
    const [user] = await db(env.DB)
      .select({
        id: schema.user.id,
        email: schema.user.email,
        displayName: schema.user.displayName,
        description: schema.user.description,
        username: schema.user.username,
        social: schema.user.social,
      })
      .from(schema.user)
      .where(eq(schema.user.username, props.username));

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    throw new Error("Failed to fetch user");
  }
};

export const updateUserById = async (
  env: Env,
  props: {
    id: string;
    description: string;
    displayName: string;
    username: string;
  }
) => {
  try {
    await db(env.DB)
      .update(schema.user)
      .set({
        description: props.description,
        displayName: props.displayName,
        username: props.username,
      })
      .where(eq(schema.user.id, props.id));
  } catch (error: any) {
    console.error("Error updating user by ID:", error.message);
    throw new Error("Failed to update user");
  }
};

export const updateSocialLinksById = async (
  env: Env,
  props: {
    userId: string;
    socialLinks: {
      github: string;
      linkedin: string;
      x: string;
      website: string;
    };
  }
) => {
  try {
    await db(env.DB)
      .update(schema.user)
      .set({
        social: props.socialLinks,
      })
      .where(eq(schema.user.id, props.userId));
  } catch (error: any) {
    console.error("Error updating social links by ID:", error.message);
    throw new Error("Failed to update social links");
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

export const getUserSettingsById = async (
  env: Env,
  props: { userId: string }
) => {
  try {
    const [user] = await db(env.DB)
      .select({
        id: schema.user.id,
        colorSettings: schema.user.colorSettings,
      })
      .from(schema.user)
      .where(eq(schema.user.id, props.userId));

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error: any) {
    console.error("Error fetching user settings by ID:", error.message);
    throw new Error("Failed to fetch user settings");
  }
};

export const updateUserSettingsById = async (
  env: Env,
  props: { userId: string; colorSettings: UserSelect["colorSettings"] }
) => {
  try {
    await db(env.DB)
      .update(schema.user)
      .set({
        colorSettings: props.colorSettings,
      })
      .where(eq(schema.user.id, props.userId));
  } catch (error: any) {
    console.error("Error updating user settings by ID:", error.message);
    throw new Error("Failed to update user settings");
  }
};

export const getUserSocialLinksById = async (
  env: Env,
  props: { userId: string }
) => {
  try {
    const [user] = await db(env.DB)
      .select({
        id: schema.user.id,
        socialLinks: schema.user.social,
      })
      .from(schema.user)
      .where(eq(schema.user.id, props.userId));

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error: any) {
    console.error("Error fetching user social links by ID:", error.message);
    throw new Error("Failed to fetch user social links");
  }
};
