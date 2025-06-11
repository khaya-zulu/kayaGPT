import { getUserByUsername } from "@/queries/user";
import { downloadImage } from "@/utils/r2";
import { createApp } from "@/utils/server";

export const imgRoute = createApp()
  .get("/avatar/:username", async (c) => {
    const username = c.req.param("username");

    const user = await getUserByUsername(c.env, { username });

    if (!user) {
      return c.notFound();
    }

    return downloadImage(c, { key: user.id, bucket: c.env.R2_PROFILE });
  })
  .get("/workspace/temp/*", (c) => {
    const output = c.req.path.split("/").slice(3);

    return downloadImage(c, {
      key: output.join("/"),
      bucket: c.env.R2_WORKSPACE,
    });
  })
  .get("/workspace/:username", async (c) => {
    const username = c.req.param("username");

    const user = await getUserByUsername(c.env, { username });

    if (!user) {
      return c.notFound();
    }

    return downloadImage(c, {
      key: user?.id,
      bucket: c.env.R2_WORKSPACE,
    });
  });
