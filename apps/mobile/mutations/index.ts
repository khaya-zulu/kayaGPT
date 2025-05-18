import { MutationOptions } from "@tanstack/react-query";
import { InferRequestType, InferResponseType, ValidationTargets } from "hono";

export type InferMutationsOptions<
  T,
  V extends keyof ValidationTargets,
> = MutationOptions<InferResponseType<T>, Error, InferRequestType<T>[V]>;
