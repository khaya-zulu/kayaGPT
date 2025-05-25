import { client } from "@/utils/client";
import { useMutation } from "@tanstack/react-query";
import { InferMutationsOptions } from ".";

type ChatDeleteMutationOptions = InferMutationsOptions<
  (typeof client.api.chat)[":chatId"]["delete"]["$post"],
  "param"
>;

export const useChatDeleteMutation = (opts: ChatDeleteMutationOptions) => {
  return useMutation({
    ...opts,
    mutationKey: [client.api.chat[":chatId"].delete.$url().pathname],
    mutationFn: async (props) => {
      const response = await client.api.chat[":chatId"].delete.$post({
        param: props,
      });

      return response.json();
    },
  });
};
