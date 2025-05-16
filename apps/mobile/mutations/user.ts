import { client, InferRequestType } from "@/utils/client";
import { useMutation } from "@tanstack/react-query";

type UserBioMutationOutput = InferRequestType<
  typeof client.api.user.bio.update.$post
>["json"];

export const useUserBioMutation = () => {
  return useMutation({
    mutationKey: [client.api.user.bio.update.$url().pathname],
    mutationFn: async (output: UserBioMutationOutput) => {
      const response = await client.api.user.bio.update.$post({
        json: output,
      });

      return response.json();
    },
  });
};

export const useUseWorkspaceMutation = () => {
  return useMutation({
    mutationKey: [client.api.user.bio["use-workspace"].$url().pathname],
    mutationFn: async (props: { key: string }) => {
      const response = await client.api.user.bio["use-workspace"].$post({
        query: props,
      });

      return response.json();
    },
  });
};
