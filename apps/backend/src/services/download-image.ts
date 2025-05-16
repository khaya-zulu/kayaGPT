import { Context as HonoContext } from "hono";
import { Context } from "@/utils/env";

export const downloadImage = async (
  c: HonoContext<Context>,
  bucket: R2Bucket,
  props: { key: string }
) => {
  const { key } = props;

  const object = await bucket.get(key);

  if (!object) {
    return c.json({ error: "Object not found" }, 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);

  headers.set("etag", object.httpEtag);

  return c.body(object.body, { headers });
};
