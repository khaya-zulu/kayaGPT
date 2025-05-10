import { useChat as useAIChat, UseChatOptions } from "@ai-sdk/react";

import { fetch as expoFetch } from "expo/fetch";

export const useChat = ({
  chatId = "",
  ...opts
}: { chatId?: string } & UseChatOptions) => {
  return useAIChat({
    api: `http://localhost:8787/api/chat/${chatId}`,
    fetch: expoFetch as unknown as typeof fetch,
    onError: (error) => {
      console.error("Error:", error);
    },
    ...opts,
  });
};
