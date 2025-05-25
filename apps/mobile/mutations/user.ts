import { client, InferRequestType } from "@/utils/client";
import {
  MutationOptions,
  QueryOptions,
  useMutation,
} from "@tanstack/react-query";
import { InferMutationsOptions, MutationOptionsHelper } from ".";

type UserBioMutationInput = InferRequestType<
  typeof client.api.user.bio.update.$post
>["json"];

export const useUserBioMutation = () => {
  return useMutation({
    mutationKey: [client.api.user.bio.update.$url().pathname],
    mutationFn: async (input: UserBioMutationInput) => {
      const response = await client.api.user.bio.update.$post({
        json: input,
      });

      return response.json();
    },
  });
};

type UseWorkspaceMutationOptions = InferMutationsOptions<
  (typeof client.api.user.bio)["use-workspace"]["$post"],
  "json"
>;

export const useUseWorkspaceMutation = (opts: UseWorkspaceMutationOptions) => {
  return useMutation({
    ...opts,
    mutationKey: [client.api.user.bio["use-workspace"].$url().pathname],
    mutationFn: async (props) => {
      const response = await client.api.user.bio["use-workspace"].$post({
        json: props,
      });

      return response.json();
    },
  });
};

type WorkspaceColorPaletteMutationOptions = InferMutationsOptions<
  (typeof client.api.user.workspace)["color-palette"]["$post"],
  "json"
>;

export const useWorkspaceColorPaletteMutation = (
  opts: WorkspaceColorPaletteMutationOptions
) => {
  return useMutation({
    ...opts,
    mutationKey: [client.api.user.workspace["color-palette"].$url().pathname],
    mutationFn: async (props) => {
      const response = await client.api.user.workspace["color-palette"].$post({
        json: props,
      });

      return response.json();
    },
  });
};

type UpdateSocialLinksMutationOptions = InferMutationsOptions<
  (typeof client.api.user.profile)["social-links"]["$post"],
  "json"
>;

export const useUpdateSocialLinksMutation = (
  opts?: UpdateSocialLinksMutationOptions
) => {
  return useMutation({
    ...opts,
    mutationKey: [client.api.user.profile["social-links"].$url().pathname],
    mutationFn: async (data) => {
      const response = await client.api.user.profile["social-links"].$post({
        json: data,
      });

      return response.json();
    },
  });
};

type UpdateUserDescriptionMutationOptions = InferMutationsOptions<
  (typeof client.api.user.profile)["description"]["$post"],
  "json"
>;

export const useUpdateUserDescriptionMutation = (
  opts?: UpdateUserDescriptionMutationOptions
) => {
  return useMutation({
    ...opts,
    mutationKey: [client.api.user.profile["description"].$url().pathname],
    mutationFn: async (data) => {
      const response = await client.api.user.profile["description"].$post({
        json: data,
      });

      return response.json();
    },
  });
};

type UpdateUsernameMutationOptions = InferMutationsOptions<
  (typeof client.api.user.profile)["username"]["$post"],
  "json"
>;

export const useUpdateUsernameMutation = (
  opts?: UpdateUsernameMutationOptions
) => {
  return useMutation({
    ...opts,
    mutationKey: [client.api.user.profile["username"].$url().pathname],
    mutationFn: async (data) => {
      const response = await client.api.user.profile["username"].$post({
        json: data,
      });

      return response.json();
    },
  });
};

type UsernameExistsMutationOptions = InferMutationsOptions<
  (typeof client.api.user.profile)["username"]["exists"]["$post"],
  "json"
>;

export const useUsernameExistsMutation = (
  opts?: UsernameExistsMutationOptions
) => {
  return useMutation({
    ...opts,
    mutationKey: [
      client.api.user.profile["username"]["exists"].$url().pathname,
    ],
    mutationFn: async (data) => {
      const response = await client.api.user.profile["username"][
        "exists"
      ].$post({
        json: data,
      });

      return response.json();
    },
  });
};
