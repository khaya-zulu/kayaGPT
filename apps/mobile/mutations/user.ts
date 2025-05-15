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
