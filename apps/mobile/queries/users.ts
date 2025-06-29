import { useQuery } from "@tanstack/react-query";

import { client, InferResponseType } from "@/utils/client";
import { InferQueryOptions } from ".";

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

      if (!response.ok) {
        throw new Error("User not found");
      }

      return response.json();
    },
  });
};

export type UserOverviewQueryOutput = InferResponseType<
  (typeof client.api.user.overview)[":username"]["$get"],
  200
>;

export const userSettingsQueryKey = [client.api.user.settings.$url().pathname];

export type UserSettingsQueryOutput = InferResponseType<
  typeof client.api.user.settings.$get
>;

export type UserSettingsQueryOptions = InferQueryOptions<
  typeof client.api.user.settings.$get
>;

export const useUserSettingsQuery = (opts: UserSettingsQueryOptions) => {
  return useQuery({
    ...opts,
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

export type UserWeatherQueryOptions = InferQueryOptions<
  typeof client.api.user.weather.$get
>;

export const useUserWeatherQuery = (
  _inputs?: undefined,
  opts?: UserWeatherQueryOptions
) => {
  return useQuery({
    ...opts,
    queryKey: [userWeatherQueryKey],
    queryFn: async () => {
      const response = await client.api.user.weather.$get();
      return response.json();
    },
  });
};

export const userRandomQueryKey = [client.api.user.random.$url().pathname];

export const useUserRandomQuery = () => {
  return useQuery({
    queryKey: userRandomQueryKey,
    queryFn: async () => {
      const response = await client.api.user.random.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch random user");
      }

      return response.json();
    },
  });
};

export type UserWeatherPublicQueryOptions = InferQueryOptions<
  (typeof client.api.user.weather)[":username"]["$get"]
>;

export const useUserWeatherPublicQuery = (
  inputs: { username: string },
  opts?: UserWeatherPublicQueryOptions
) => {
  return useQuery({
    ...opts,
    queryKey: [client.api.user.weather[":username"].$url().pathname],
    queryFn: async () => {
      const response = await client.api.user.weather[":username"].$get({
        param: { username: inputs.username },
      });

      if (!response.ok) {
        throw new Error("User not found");
      }

      return response.json();
    },
  });
};
