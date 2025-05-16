import { app } from "@/utils/server";

export const workspaceRoute = app.get("*", async (c) => {
  console.log("Workspace route hit", c.req.path);

  const output = c.req.path.split("/").slice(3);
  const object = await c.env.WORKSPACE.get(`/${output.join("/")}`);

  if (!object) {
    return c.json({ error: "Object not found" }, 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);

  headers.set("etag", object.httpEtag);

  return new Response(object.body, {
    headers,
  });
});
