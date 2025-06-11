import { UseQueryOptions } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type InferQueryOptions<T> = Omit<
  UseQueryOptions<InferResponseType<T, 200>, Error>,
  "queryKey" | "queryFn"
>;
