import { client, InferResponseType } from "@/utils/client";
import { useQuery } from "@tanstack/react-query";

export type ChatHistoryQueryOutput = InferResponseType<
  typeof client.api.chat.$get
>;

export const useChatHistoryQuery = () => {
  return useQuery({
    queryKey: ["/chat"],
    queryFn: async () => {
      const response = await client.api.chat.$get();
      return response.json();
    },
  });
};
