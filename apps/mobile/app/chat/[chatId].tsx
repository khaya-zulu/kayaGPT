import { styled } from "styled-components/native";

import { ToolInvocationUIPart } from "@ai-sdk/ui-utils";

import {
  Keyboard,
  Pressable,
  View,
  SafeAreaView,
  ScrollView,
} from "react-native";

import { Text } from "@/components/text";

import { zinc200, zinc100 } from "@/constants/theme";
import {
  AppWindow,
  ArrowDown,
  ArrowLeft,
  ChatCircleDots,
} from "phosphor-react-native";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { isWeb } from "@/constants/platform";
import { BlurView } from "expo-blur";
import { useChat } from "@/hooks/use-chat";
import { chatHistoryQueryKey, useChatMessagesQuery } from "@/queries/chat";
import { useWatch } from "@/hooks/use-watch";

import { Rounded } from "@/components/rounded";

import { ChatFrame } from "@/features/main-app-box";
import { ChatMessage } from "@/features/chat-message";
import { ChatBoxToolbar } from "@/features/chat-box/toolbar";
import { useChatDeleteMutation } from "@/mutations/chat";
import { Tool } from "@/features/tool";
import { ProfileEditor } from "@/features/profile-editor";
import { useQueryClient } from "@tanstack/react-query";
import { useUserSettings } from "@/hooks/use-user-settings";

const MobileKeyboardDismiss = styled.Pressable`
  max-width: 650px;
  margin: 0 auto;
  width: 100%;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;

const WebKeyboardDismiss = styled.View`
  max-width: 650px;
  margin: 0 auto;
  width: 100%;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;

const ToolbarBox = styled.View<{ color: string; isShaded?: boolean }>`
  flex-direction: row;
  border: 1px solid ${({ color }) => color + "80"};
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  background-color: ${(props) =>
    props.isShaded ? props.color + "66" : "transparent"};
`;

export default function ChatIdPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ message?: string; chatId: string }>();
  const utils = useQueryClient();

  const userSettings = useUserSettings();

  const scrollViewRef = useRef<ScrollView>(null);

  const [isNewMessage, setIsNewMessage] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [scrollViewContentHeight, setScrollViewContentHeight] = useState(0);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const [isScrollToBottomVisible, setIsScrollToBottomVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  const {
    handleInputChange,
    input,
    handleSubmit,
    append,
    messages,
    setMessages,
  } = useChat({
    chatId: params.chatId,
    onToolCall: (call) => {
      if (call.toolCall.toolName === "description") {
        setIsDescriptionOpen(true);
      }
    },
  });

  const isMessageQueryEnabled = !isNewMessage && !params.message;

  const KeyboardDismiss: any = isWeb
    ? WebKeyboardDismiss
    : MobileKeyboardDismiss;

  const chatDeleteMutation = useChatDeleteMutation({
    onSuccess: async () => {
      await utils.invalidateQueries({
        queryKey: chatHistoryQueryKey,
      });

      router.navigate("/");
    },
  });

  const messagesQuery = useChatMessagesQuery({
    chatId: params.chatId,
    // only fetch if the page navigation is not
    // the result of a new message
    isEnabled: isMessageQueryEnabled,
  });

  useWatch(messagesQuery.isSuccess, (prev, curr) => {
    if (curr) {
      const chatMessages = messagesQuery.data?.messages;
      if (chatMessages) {
        setMessages(
          chatMessages.map((cm) => {
            const toolParts: ToolInvocationUIPart[] = (cm.tools ?? [])?.map(
              (t) => {
                return {
                  type: "tool-invocation",
                  toolInvocation: {
                    args: {},
                    result: t.result,
                    toolCallId: t.toolId,
                    toolName: t.toolName,
                    state: "result",
                  },
                };
              }
            );

            return {
              id: cm.id,
              role: cm.role === "assistant" ? "assistant" : "user",
              content: cm.content,
              createdAt: cm.createdAt ? new Date(cm.createdAt) : undefined,
              parts: [
                {
                  type: "text",
                  text: cm.content,
                },
                ...toolParts,
              ],
            };
          })
        );

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({
            animated: false,
          });
        }, 50);
      }
    }
  });

  useEffect(() => {
    if (!!params.message && params.message !== "undefined") {
      append({
        role: "user",
        content: params.message,
      });

      router.setParams({ message: undefined });
      setIsNewMessage(true);
    }
  }, [params.message]);

  return (
    <ChatFrame
      isSafeAreaDisabled
      value={input}
      onChange={(ev) => {
        handleInputChange({
          ...ev,
          target: {
            ...ev.target,
            value: ev.nativeEvent.text,
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      }}
      onSubmit={() => {
        scrollViewRef.current?.scrollToEnd({
          animated: true,
        });
        handleSubmit();
      }}
      toolbar={
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text fontSize="sm">12:00 AM Jun 12</Text>

          <Pressable
            onPress={() => setIsDescriptionOpen((prevState) => !prevState)}
          >
            <AppWindow
              size={20}
              color={
                isDescriptionOpen
                  ? userSettings.colorSettings["base"]
                  : undefined
              }
            />
          </Pressable>
        </View>
      }
      bottomToolbar={
        <ChatBoxToolbar
          isTitleEnabled={isMessageQueryEnabled}
          onChatDelete={() => {
            chatDeleteMutation.mutate({ chatId: params.chatId });
          }}
        />
      }
      rightLayout={
        isDescriptionOpen ? (
          <ProfileEditor onClose={() => setIsDescriptionOpen(false)} />
        ) : null
      }
    >
      {!isWeb ? (
        <ToolbarBox
          color={userSettings.colorSettings[100]}
          isShaded={scrollY > 20}
        >
          <SafeAreaView>
            <Pressable
              onPress={() => router.back()}
              style={{
                paddingHorizontal: 25,
                paddingBottom: 20,
                paddingTop: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <ArrowLeft size={18} weight="bold" />
                <Text>Hello world</Text>
              </View>

              <ChatCircleDots size={20} weight="bold" />
            </Pressable>
          </SafeAreaView>
        </ToolbarBox>
      ) : null}
      <SafeAreaView style={{ flex: 1, position: "relative" }}>
        <ScrollView
          ref={scrollViewRef}
          scrollEventThrottle={16}
          onScroll={(ev) => {
            const scrollY = ev.nativeEvent.contentOffset.y;
            const totalHeight = scrollViewContentHeight - scrollViewHeight;

            setScrollY(scrollY);
            setIsScrollToBottomVisible(scrollY < totalHeight - 200);
          }}
          onLayout={(ev) => {
            setScrollViewHeight(ev.nativeEvent.layout.height);
          }}
        >
          <KeyboardDismiss onPress={() => Keyboard.dismiss()}>
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 20,
                flexDirection: "column",
                gap: 18,
                paddingBottom: 200,
              }}
              onLayout={(ev) => {
                setScrollViewContentHeight(ev.nativeEvent.layout.height);
              }}
            >
              {messages.map((m, idx) => {
                const tools = m.parts.filter(
                  (p) => p.type === "tool-invocation"
                );

                return (
                  <ChatMessage
                    key={m.id}
                    role={m.role === "assistant" ? "Assistant" : "User"}
                    messageId={m.id}
                    parts={m.parts}
                    createdAt={m.createdAt}
                  >
                    {tools.map((t, idx) => (
                      <Tool key={"tool" + idx} invocation={t.toolInvocation} />
                    ))}
                  </ChatMessage>
                );
              })}
            </View>
          </KeyboardDismiss>
        </ScrollView>
        {isScrollToBottomVisible ? (
          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              bottom: 5,
              left: 0,
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Pressable onPress={() => scrollViewRef.current?.scrollToEnd()}>
              <Rounded
                size="full"
                style={{
                  padding: 10,
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: zinc100,
                }}
              >
                <ArrowDown size={15} />
              </Rounded>
            </Pressable>
          </View>
        ) : null}
      </SafeAreaView>
    </ChatFrame>
  );
}
