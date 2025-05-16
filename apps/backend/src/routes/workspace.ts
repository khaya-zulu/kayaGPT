import { downloadImage } from "@/services/download-image";
import { createApp } from "@/utils/server";

export const workspaceRoute = createApp().get("*", async (c) => {
  const output = c.req.path.split("/").slice(3);
  return downloadImage(c, c.env.R2_WORKSPACE, { key: output.join("/") });
});
