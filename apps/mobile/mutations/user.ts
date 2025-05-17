import { client, InferRequestType } from "@/utils/client";
import { useMutation } from "@tanstack/react-query";

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

type UseWorkspaceMutationInput = InferRequestType<
  (typeof client.api.user.bio)["use-workspace"]["$post"]
>["json"];

export const useUseWorkspaceMutation = () => {
  return useMutation({
    mutationKey: [client.api.user.bio["use-workspace"].$url().pathname],
    mutationFn: async (props: UseWorkspaceMutationInput) => {
      const response = await client.api.user.bio["use-workspace"].$post({
        json: props,
      });

      return response.json();
    },
  });
};
