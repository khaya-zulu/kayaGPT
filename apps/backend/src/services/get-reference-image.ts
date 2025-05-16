import { Env } from "@/utils/env";
import { toFile } from "openai";

export const getReferenceImage = async () => {
  const resp = await fetch(
    "https://images.unsplash.com/photo-1526887593587-a307ea5d46b4?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );

  const blob = await resp.blob();

  return toFile(blob, null, {
    type: "image/png",
  });
};
