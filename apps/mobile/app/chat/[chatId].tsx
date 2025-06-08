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

import { zinc100 } from "@/constants/theme";
import {
  AppWindow,
  ArrowDown,
  ArrowLeft,
  ChatCircleDots,
} from "phosphor-react-native";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { isWeb } from "@/constants/platform";
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
import { DateNow } from "@/features/date-now";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { ProfileEditorBottomSheet } from "@/features/profile-editor/bottom-sheet";

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
  const params = useLocalSearchParams<{
    message?: string;
    chatId: string;
    isOnboarding?: "true";
  }>();
  const utils = useQueryClient();

  const userSettings = useUserSettings();

  const scrollViewRef = useRef<ScrollView>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [isNewMessage, setIsNewMessage] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [scrollViewContentHeight, setScrollViewContentHeight] = useState(0);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState<
    "general" | "description" | "social" | undefined
  >();

  const [isScrollToBottomVisible, setIsScrollToBottomVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

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
      if (call.toolCall.toolName === "profileSettings") {
        setIsProfileEditorOpen((call.toolCall.args as any).tab);
      }
    },
  });

  const isMessageQueryEnabled =
    !isNewMessage && !params.message && !params.isOnboarding;

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
    // only fetch chat messages if nots a new
    // chat result.
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
    } else if (params.isOnboarding === "true") {
      append({
        role: "user",
        content: "Hi",
      });

      router.setParams({ isOnboarding: undefined });
      setIsNewMessage(true);
    }
  }, [params.message]);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <ChatFrame
          isSafeAreaDisabled
          value={input}
          scrollProgress={scrollProgress}
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
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <DateNow />

              <Pressable
                onPress={() => {
                  setIsProfileEditorOpen((prevState) => {
                    if (prevState) {
                      bottomSheetRef.current?.close();
                    } else if (!isWeb) {
                      bottomSheetRef.current?.present();
                    }

                    return prevState ? undefined : "general";
                  });
                }}
              >
                <AppWindow
                  size={20}
                  color={
                    isProfileEditorOpen
                      ? userSettings.colorSettings["base"]
                      : undefined
                  }
                />
              </Pressable>
            </View>
          }
          bottomToolbar={
            userSettings.isOnboardingComplete ? (
              <ChatBoxToolbar
                isTitleEnabled={isMessageQueryEnabled}
                onChatDelete={() => {
                  chatDeleteMutation.mutate({ chatId: params.chatId });
                }}
              />
            ) : (
              <View />
            )
          }
          rightLayout={
            isWeb && isProfileEditorOpen ? (
              <ProfileEditor
                onClose={() => setIsProfileEditorOpen(undefined)}
                tab={isProfileEditorOpen}
              />
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

                const progress = Math.min(1, scrollY / (totalHeight || 1));
                setScrollProgress(progress * 100);

                setScrollY(scrollY);
                setIsScrollToBottomVisible(scrollY < totalHeight - 200);
              }}
              onLayout={(ev) => {
                setScrollViewHeight(ev.nativeEvent.layout.height);
              }}
              showsVerticalScrollIndicator={false}
            >
              <KeyboardDismiss onPress={() => Keyboard.dismiss()}>
                <View
                  style={{
                    paddingHorizontal: isWeb ? 20 : 15,
                    paddingTop: 20,
                    flexDirection: "column",
                    gap: isWeb ? 18 : 10,
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
                          <Tool
                            key={"tool" + idx}
                            invocation={t.toolInvocation}
                          />
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
        {!isWeb ? (
          <ProfileEditorBottomSheet
            ref={bottomSheetRef}
            onClose={() => {
              bottomSheetRef.current?.close();
            }}
          />
        ) : null}
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
