import { useChat as useAIChat, UseChatOptions } from "@ai-sdk/react";

import { fetch as expoFetch } from "expo/fetch";

type Props = { chatId?: string; authToken?: string | null } & UseChatOptions;

export const useChat = ({ chatId = "", authToken, ...opts }: Props) => {
  return useAIChat({
    api: `http://localhost:8787/api/chat/${chatId}`,
    fetch: expoFetch as unknown as typeof fetch,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    onError: (error) => {
      console.error("Error:", error);
    },
    ...opts,
  });
};
