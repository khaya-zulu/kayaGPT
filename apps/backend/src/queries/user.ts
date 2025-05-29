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

    return user as typeof user | undefined;
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

export const updateUserDescriptionById = async (
  env: Env,
  props: { userId: string; decription: string }
) => {
  try {
    await db(env.DB)
      .update(schema.user)
      .set({
        description: props.decription,
      })
      .where(eq(schema.user.id, props.userId));
  } catch (error: any) {
    console.error("Error updating user description by ID:", error.message);
    throw new Error("Failed to update user description");
  }
};

export const updateUsernameById = async (
  env: Env,
  props: { userId: string; username: string }
) => {
  try {
    await db(env.DB)
      .update(schema.user)
      .set({
        username: props.username,
      })
      .where(eq(schema.user.id, props.userId));
  } catch (error: any) {
    console.error("Error updating username by ID:", error.message);
    throw new Error("Failed to update username");
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

export const getUsernameById = async (env: Env, props: { userId: string }) => {
  try {
    const [user] = await db(env.DB)
      .select({
        id: schema.user.id,
        username: schema.user.username,
      })
      .from(schema.user)
      .where(eq(schema.user.id, props.userId));

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (err: any) {
    console.error("Error fetching username by ID:", err.message);
    throw new Error("Failed to fetch username");
  }
};

export const getUserProfileById = async (
  env: Env,
  props: { userId: string }
) => {
  try {
    const [user] = await db(env.DB)
      .select({
        id: schema.user.id,
        username: schema.user.username,
        displayName: schema.user.displayName,
        region: schema.user.region,
        social: schema.user.social,
        description: schema.user.description,
      })
      .from(schema.user)
      .where(eq(schema.user.id, props.userId));

    if (!user) {
      throw new Error("User not found");
    }

    return {
      ...user,
      region: {
        flag: user.region?.flag,
        name: user.region?.name,
      },
    };
  } catch (error: any) {
    console.error("Error fetching user profile by ID:", error.message);
    throw new Error("Failed to fetch user profile");
  }
};

export const updateUserProfileById = async (
  env: Env,
  props: {
    userId: string;
    displayName: string;
    description: string;
    username: string;
    region: { flag: string; name: string; lng: string; lat: string } | null;
    social: {
      github?: string;
      linkedin?: string;
      x?: string;
      website?: string;
    };
  }
) => {
  try {
    await db(env.DB)
      .update(schema.user)
      .set(props)
      .where(eq(schema.user.id, props.userId));
  } catch (error: any) {
    console.error("Error updating user profile by ID:", error.message);
    throw new Error("Failed to update user profile");
  }
};

export const getUserRegionById = async (
  env: Env,
  props: { userId: string }
) => {
  try {
    const [user] = await db(env.DB)
      .select({
        id: schema.user.id,
        region: schema.user.region,
      })
      .from(schema.user)
      .where(eq(schema.user.id, props.userId));

    if (!user) {
      throw new Error("User not found");
    }

    return user.region;
  } catch (error: any) {
    console.error("Error fetching user region by ID:", error.message);
    throw new Error("Failed to fetch user region");
  }
};

export const searchUserByUsername = async (
  env: Env,
  props: { username: string }
) => {
  try {
    const [users] = await db(env.DB)
      .select({
        id: schema.user.id,
        username: schema.user.username,
      })
      .from(schema.user)
      .where(eq(schema.user.username, props.username));

    return users;
  } catch (error: any) {
    console.error("Error searching user by username:", error.message);
    throw new Error("Failed to search user");
  }
};
