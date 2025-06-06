import { downloadImage } from "@/utils/r2";
import { createApp } from "@/utils/server";

export const workspaceRoute = createApp().get("*", async (c) => {
  const output = c.req.path.split("/").slice(3);

  return downloadImage(c, {
    key: output.join("/"),
    bucket: c.env.R2_WORKSPACE,
  });
});
