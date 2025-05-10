import { client } from "@/utils/client";
import { useQuery } from "@tanstack/react-query";

export const useChatHistory = async () => {
  return useQuery({
    queryKey: ["chatHistory"],
    queryFn: async () => {
      const response = await client.api.chat.$get();
      return response.json();
    },
  });
};
