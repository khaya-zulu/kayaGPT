import { Context as HonoContext } from "hono";
import { Context } from "@/utils/env";

export const downloadImage = async (
  c: HonoContext<Context>,
  props: { key: string; bucket: R2Bucket }
) => {
  const { key } = props;

  const object = await props.bucket.get(key);

  if (!object) {
    return c.json({ error: "Object not found" }, 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);

  headers.set("etag", object.httpEtag);

  return c.body(object.body, { headers });
};

export const isObjectExists = async (
  bucket: R2Bucket,
  key: string
): Promise<boolean> => {
  const object = await bucket.get(key);
  return object !== null && object !== undefined;
};
