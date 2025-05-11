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

export const useChatMessagesQuery = (props: {
  chatId: string;
  isEnabled?: boolean;
}) => {
  return useQuery({
    queryKey: [`/chat/${props.chatId}/messages`],
    queryFn: async () => {
      const response = await client.api.chat[":chatId"].messages.$get({
        param: { chatId: props.chatId },
      });
      return response.json();
    },
    enabled: props.isEnabled,
  });
};

export const useChatTitleQuery = (
  chatId: string,
  props?: { isEnabled?: boolean }
) => {
  return useQuery({
    queryKey: [`/chat/${chatId}/title`],
    queryFn: async () => {
      const response = await client.api.chat[":chatId"].title.$get({
        param: { chatId },
      });
      return response.json();
    },
    enabled: props?.isEnabled,
  });
};
