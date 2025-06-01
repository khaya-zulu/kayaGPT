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

export type UserOverviewQueryOutput = InferResponseType<
  (typeof client.api.user.overview)[":username"]["$get"]
>;

export const userSettingsQueryKey = [client.api.user.settings.$url().pathname];

export type UserSettingsQueryOutput = InferResponseType<
  typeof client.api.user.settings.$get
>;

export const useUserSettingsQuery = () => {
  return useQuery({
    queryKey: userSettingsQueryKey,
    queryFn: async () => {
      const response = await client.api.user.settings.$get();
      return response.json();
    },
  });
};

export const useUserDescriptionQuery = () => {
  return useQuery({
    queryKey: [client.api.user.profile.description.$url().pathname],
    queryFn: async () => {
      const response = await client.api.user.profile.description.$get();
      return response.json();
    },
  });
};

export const userProfileSettingsQueryKey = [
  client.api.user.profile.settings.$url().pathname,
];

export const useUserProfileSettingsQuery = () => {
  return useQuery({
    queryKey: userProfileSettingsQueryKey,
    queryFn: async () => {
      const response = await client.api.user.profile.settings.$get();
      return response.json();
    },
  });
};

export const userWeatherQueryKey = [client.api.user.weather.$url().pathname];

export const useUserWeatherQuery = () => {
  return useQuery({
    queryKey: [userWeatherQueryKey],
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      const response = await client.api.user.weather.$get();
      return response.json();
    },
  });
};
