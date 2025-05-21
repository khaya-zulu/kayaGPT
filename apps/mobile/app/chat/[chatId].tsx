import { styled } from "styled-components/native";

import {
  Keyboard,
  Pressable,
  View,
  SafeAreaView,
  ScrollView,
} from "react-native";

import { Text } from "@/components/text";

import { zinc200, zinc100 } from "@/constants/theme";
import { ArrowDown, ArrowLeft, ChatCircleDots } from "phosphor-react-native";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { isWeb } from "@/constants/platform";
import { BlurView } from "expo-blur";
import { useChat } from "@/hooks/use-chat";
import { useChatMessagesQuery } from "@/queries/chat";
import { useWatch } from "@/hooks/use-watch";

import { Rounded } from "@/components/rounded";

import { ChatFrame } from "@/features/main-app-box";
import { ChatMessage } from "@/features/chat-message";
import { ChatBoxToolbar } from "@/features/chat-box/toolbar";
import { useChatDeleteMutation } from "@/mutations/chat";
import { Tool } from "@/features/tool-ui";

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

const ToolbarBox = styled.View`
  flex-direction: row;
  border: 1px solid ${zinc200 + "80"};
  border-top-color: transparent;
`;

export default function ChatIdPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ message?: string; chatId: string }>();

  const scrollViewRef = useRef<ScrollView>(null);

  const [isNewMessage, setIsNewMessage] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [scrollViewContentHeight, setScrollViewContentHeight] = useState(0);

  const [isScrollToBottomVisible, setIsScrollToBottomVisible] = useState(true);

  const {
    handleInputChange,
    input,
    handleSubmit,
    append,
    messages,
    setMessages,
  } = useChat({
    chatId: params.chatId,
  });

  const isMessageQueryEnabled = !isNewMessage && !params.message;

  const KeyboardDismiss = isWeb ? WebKeyboardDismiss : MobileKeyboardDismiss;

  const chatDeleteMutation = useChatDeleteMutation();

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
            return {
              id: cm.id,
              role: cm.role === "assistant" ? "assistant" : "user",
              content: cm.content,
              parts: [
                {
                  type: "text",
                  text: cm.content,
                },
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
        <ChatBoxToolbar
          isTitleEnabled={isMessageQueryEnabled}
          onChatDelete={async () => {
            await chatDeleteMutation.mutateAsync({ chatId: params.chatId });
            router.navigate("/");
          }}
        />
      }
    >
      {!isWeb ? (
        <ToolbarBox>
          <View
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              backgroundColor: "#fff",
              opacity: 0.2,
            }}
          />
          <SafeAreaView>
            <BlurView intensity={20}>
              <Pressable
                onPress={() => router.back()}
                style={{
                  paddingHorizontal: 20,
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
            </BlurView>
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
