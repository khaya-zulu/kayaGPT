import { useChat as useAIChat, UseChatOptions } from "@ai-sdk/react";
import { useAuth } from "@clerk/clerk-expo";

import { fetch as expoFetch } from "expo/fetch";

type Props = { chatId?: string; path?: string } & UseChatOptions;

export const useChat = ({ chatId = "", path, ...opts }: Props) => {
  const { getToken } = useAuth();

  return useAIChat({
    api: `http://localhost:8787/api${path ?? `/chat/${chatId}`}`,
    // fetch: expoFetch as unknown as typeof fetch,
    fetch: async (url, opts) => {
      const token = await getToken();

      return expoFetch(url as any, {
        ...(opts as any),
        headers: {
          ...opts?.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onError: (error) => {
      console.error("Error:", error);
    },
    ...opts,
  });
};
