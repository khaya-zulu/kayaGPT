import { styled } from "styled-components/native";

import { ToolInvocationUIPart } from "@ai-sdk/ui-utils";

import {
  Keyboard,
  Pressable,
  View,
  SafeAreaView,
  ScrollView,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  FlatList,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from "react-native";

import { zinc100 } from "@/constants/theme";
import { AppWindow, ArrowDown, ChatCircleDots } from "phosphor-react-native";
import { Fragment, FragmentProps, useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useChat } from "@/hooks/use-chat";
import { chatHistoryQueryKey, useChatMessagesQuery } from "@/queries/chat";
import { useWatch } from "@/hooks/use-watch";

import { Rounded } from "@/components/rounded";

import { ChatFrame } from "@/features/main-app-box";
import { BackToolbar, ChatBoxToolbar } from "@/features/chat-box/toolbar";
import { useChatDeleteMutation } from "@/mutations/chat";
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
import { useMobile } from "@/hooks/use-mobile";
import { ChatMessage } from "@/features/chat-message";
import { Tool } from "@/features/tool";

const MobileKeyboardDismiss = (props: FragmentProps) => {
  return <Fragment {...props} />;
};

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

  const scrollViewRef = useRef<FlatList>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [isNewMessage, setIsNewMessage] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [scrollViewContentHeight, setScrollViewContentHeight] = useState(0);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState<
    "general" | "description" | "social" | undefined
  >();

  const [isScrollToBottomVisible, setIsScrollToBottomVisible] = useState(true);
  const [isFirstMessageIgnored, setIsFirstMessageIgnored] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { isMobile } = useMobile();

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
      const toolName = call.toolCall.toolName;

      if (toolName === "profileSettings") {
        setIsProfileEditorOpen((call.toolCall.args as any).tab);
      }
    },
  });

  const isMessageQueryEnabled =
    !isNewMessage && !params.message && !params.isOnboarding;

  const KeyboardDismiss: any = isMobile
    ? MobileKeyboardDismiss
    : WebKeyboardDismiss;

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

  //#region chat message handling
  const handleChatInputChange = (
    ev: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    handleInputChange({
      ...ev,
      target: {
        ...ev.target,
        value: ev.nativeEvent.text,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const handleChatInputSubmit = () => {
    scrollViewRef.current?.scrollToIndex({
      index: messages.length - 1,
      animated: true,
    });
    handleSubmit();
  };
  //#endregion

  //#region bottom sheet handling
  const handleBottomSheetToggle = () => {
    setIsProfileEditorOpen((prevState) => {
      if (prevState) {
        bottomSheetRef.current?.close();
      } else if (isMobile) {
        bottomSheetRef.current?.present();
      }

      return prevState ? undefined : "general";
    });
  };
  //#endregion

  //#region scroll handling
  const handleOnScroll = (ev: NativeSyntheticEvent<any>) => {
    const scrollY = ev.nativeEvent.contentOffset.y;
    const totalHeight = scrollViewContentHeight - scrollViewHeight;

    const progress = Math.min(1, scrollY / (totalHeight || 1));
    setScrollProgress(progress * 100);

    setScrollY(scrollY);
    setIsScrollToBottomVisible(scrollY < totalHeight - 200);
  };
  //#endregion

  useEffect(() => {
    if (messagesQuery.isSuccess) {
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
  }, [messagesQuery.isSuccess]);

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

      setIsFirstMessageIgnored(true);
    }
  }, [params.message]);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <ChatFrame
          isSafeAreaDisabled
          value={input}
          scrollProgress={scrollProgress}
          onChange={handleChatInputChange}
          onSubmit={handleChatInputSubmit}
          toolbar={
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <DateNow />

              <Pressable onPress={handleBottomSheetToggle}>
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
            !isMobile && isProfileEditorOpen ? (
              <ProfileEditor
                onClose={() => setIsProfileEditorOpen(undefined)}
                tab={isProfileEditorOpen}
              />
            ) : null
          }
        >
          {isMobile ? (
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
                  <BackToolbar />

                  <ChatCircleDots size={20} weight="bold" />
                </Pressable>
              </SafeAreaView>
            </ToolbarBox>
          ) : null}
          <SafeAreaView style={{ flex: 1, position: "relative" }}>
            <KeyboardDismiss>
              <View
                onLayout={(ev) => {
                  setScrollViewHeight(ev.nativeEvent.layout.height);
                }}
                style={{ flex: 1 }}
              >
                <FlatList
                  ref={scrollViewRef as any}
                  data={messages}
                  onLayout={(ev) => {
                    setScrollViewContentHeight(ev.nativeEvent.layout.height);
                  }}
                  showsVerticalScrollIndicator={false}
                  onScroll={handleOnScroll}
                  scrollEventThrottle={16}
                  contentContainerStyle={{
                    gap: isMobile ? 10 : 18,
                    paddingHorizontal: isMobile ? 15 : 20,
                    paddingTop: 20,
                    paddingBottom: 200,
                    flexGrow: 1,
                  }}
                  style={{ flex: 1 }}
                  renderItem={({ item, index }) => {
                    if (isFirstMessageIgnored && index === 0) {
                      return null;
                    }

                    const tools = item.parts?.filter(
                      (p) => p.type === "tool-invocation"
                    );

                    return (
                      <ChatMessage
                        key={item.id}
                        role={item.role === "assistant" ? "Assistant" : "User"}
                        messageId={item.id}
                        parts={item.parts}
                        createdAt={item.createdAt}
                      >
                        {tools?.map((t, idx) => (
                          <Tool
                            key={"tool" + idx}
                            invocation={t.toolInvocation}
                          />
                        ))}
                      </ChatMessage>
                    );
                  }}
                />
              </View>
            </KeyboardDismiss>
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
                <Pressable
                  onPress={() =>
                    scrollViewRef.current?.scrollToIndex({
                      index: messages.length - 1,
                    })
                  }
                >
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
        {isMobile ? (
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
