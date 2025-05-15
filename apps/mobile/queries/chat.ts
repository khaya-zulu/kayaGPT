import { client, InferResponseType } from "@/utils/client";
import { useQuery } from "@tanstack/react-query";

export type ChatHistoryQueryOutput = InferResponseType<
  typeof client.api.chat.$get
>;

export const chatHistoryQueryKey = [client.api.chat.$url().pathname];

export const useChatHistoryQuery = () => {
  return useQuery({
    queryKey: chatHistoryQueryKey,
    queryFn: async () => {
      const response = await client.api.chat.$get();
      return response.json();
    },
  });
};

export const chatMessageQueryKey = (props: { chatId: string }) => {
  return [
    client.api.chat[":chatId"].messages.$url({
      param: props,
    }).pathname,
  ];
};

export const useChatMessagesQuery = (props: {
  chatId: string;
  isEnabled?: boolean;
}) => {
  return useQuery({
    queryKey: chatMessageQueryKey(props),
    queryFn: async () => {
      const response = await client.api.chat[":chatId"].messages.$get({
        param: { chatId: props.chatId },
      });
      return response.json();
    },
    enabled: props.isEnabled,
  });
};

export const chatTitleQueryKey = (props: { chatId: string }) => {
  return [client.api.chat[":chatId"].title.$url({ param: props })];
};

export const useChatTitleQuery = (
  chatId: string,
  props?: { isEnabled?: boolean }
) => {
  return useQuery({
    queryKey: chatTitleQueryKey({ chatId }),
    queryFn: async () => {
      const response = await client.api.chat[":chatId"].title.$get({
        param: { chatId },
      });
      return response.json();
    },
    enabled: props?.isEnabled,
  });
};
