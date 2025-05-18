import { useQuery } from "@tanstack/react-query";

import { client, InferResponseType } from "@/utils/client";

export const userBioQueryKey = [client.api.user.bio.$url().pathname];

export const useUserBioQuery = () => {
  return useQuery({
    queryKey: userBioQueryKey,
    queryFn: async () => {
      const response = await client.api.user.bio.$get();
      return response.json();
    },
  });
};

export const userOverviewQueryKey = (username: string) => {
  return [
    client.api.user.overview[":username"].$url({ param: { username } })
      .pathname,
  ];
};

export const useUserOverviewQuery = (username: string) => {
  return useQuery({
    queryKey: userOverviewQueryKey(username),
    queryFn: async () => {
      const response = await client.api.user.overview[":username"].$get({
        param: { username },
      });
      return response.json();
    },
  });
};

export const userSettingsQueryKey = [client.api.user.settings.$url().pathname];

export type UserSettingsQueryOutput = InferResponseType<
  typeof client.api.user.settings.$get
>;

export const useUserSettingsQuery = () => {
  return useQuery({
    queryKey: userSettingsQueryKey,
    queryFn: async () => {
      const response = await client.api.user.settings.$get();
      console.log("user settings");
      return response.json();
    },
  });
};
