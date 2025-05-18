import { client } from "@/utils/client";
import { useMutation } from "@tanstack/react-query";

export const useChatDeleteMutation = () => {
  return useMutation({
    mutationKey: [client.api.chat[":chatId"].delete.$url().pathname],
    mutationFn: async ({ chatId }: { chatId: string }) => {
      const response = await client.api.chat[":chatId"].delete.$post({
        param: {
          chatId,
        },
      });

      return response.json();
    },
  });
};
