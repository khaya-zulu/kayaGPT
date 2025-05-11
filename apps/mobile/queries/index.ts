import { UseQueryOptions } from "@tanstack/react-query";

export type QueryOptions = Omit<UseQueryOptions, "queryKey" | "queryFn">;

export const mergeQueryOptions = <Fn extends UseQueryOptions["queryFn"]>(
  opts: QueryOptions & { queryKey: UseQueryOptions["queryKey"]; queryFn: Fn }
) => {
  return opts;
};
