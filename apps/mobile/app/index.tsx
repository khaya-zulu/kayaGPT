import {
  Keyboard,
  NativeSyntheticEvent,
  ScrollView,
  TextInputChangeEventData,
  View,
} from "react-native";
import { Redirect, useRouter } from "expo-router";
import { styled } from "styled-components/native";

import * as Crypto from "expo-crypto";

import { ChatFrame } from "@/features/main-app-box";
import { Rounded } from "@/components/rounded";

import { ChatSummary } from "@/features/chat-summary";
import { useChat } from "@/hooks/use-chat";
import { useChatHistoryQuery } from "@/queries/chat";
import { ChatBoxToolbar } from "@/features/chat-box/toolbar";
import { BlurView } from "expo-blur";
import { useAuth } from "@clerk/clerk-expo";
import { NavigationMenu } from "@/features/navigation-menu";
import { DateNow } from "@/features/date-now";
import { useMobile } from "@/hooks/use-mobile";
import { FadeIn, FadeInUp } from "react-native-reanimated";
import { useUserSettings } from "@/hooks/use-user-settings";
import { AnimatedView } from "@/components/animated-view";
import { useEffect } from "react";
import { FadeInView } from "@/components/fadein-view";

const Container = styled.Pressable<{ isMobile?: boolean }>`
  max-width: 512px;
  margin: 0 auto;
  width: 100%;
  flex-direction: column;
  gap: ${(props) => (props.isMobile ? "0px" : "10px")};
  flex: 1;
`;

export default function IndexPage() {
  const router = useRouter();

  const { isSignedIn } = useAuth();
  const { isAnimatedDoneState, completeAnimation } = useUserSettings();
  const { handleInputChange, input, setInput } = useChat({});

  const { isMobile } = useMobile();

  const chatHistoryQuery = useChatHistoryQuery();

  const chatHistory = chatHistoryQuery.data;

  //#region chat form
  const handleChatFormSubmit = () => {
    completeAnimation("index");

    if (input.trim() === "") return;
    router.push(`/chat/${Crypto.randomUUID()}?message=${input}`);
    setInput("");
  };

  const handleChatFormChange = (
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
  //#endregion

  useEffect(() => {
    const chats = chatHistory?.chats || [];
    // context: the browser reruns the animations
    // when the page is navigated back to
    // so we want to skip the animation if it's already done
    if (chats.length && !isAnimatedDoneState.index) {
      const timerId = setTimeout(
        () => {
          completeAnimation("index");
        },
        chats.length * 150 + 500
      );

      return () => clearTimeout(timerId);
    }
  }, [isAnimatedDoneState.index, chatHistory?.chats.length]);

  if (!isSignedIn) {
    return <Redirect href="/signin" />;
  }

  return (
    <ChatFrame
      onChange={handleChatFormChange}
      value={input}
      onSubmit={handleChatFormSubmit}
      bottomToolbar={<ChatBoxToolbar />}
      toolbar={<DateNow />}
      isChatAnimationDisabled={isAnimatedDoneState.index}
    >
      <Container onPress={() => Keyboard.dismiss()} isMobile={isMobile}>
        <FadeInView isAnimationDisabled={isAnimatedDoneState.index} delay={250}>
          <NavigationMenu />
        </FadeInView>
        <FadeInView
          style={{ flex: 1 }}
          isAnimationDisabled={isAnimatedDoneState.index}
          delay={150}
        >
          <Rounded
            size={isMobile ? 0 : 24}
            style={{
              flex: 1,
              width: "100%",
              overflow: "hidden",
              marginBottom: isMobile ? 0 : 15,
            }}
          >
            <BlurView
              tint="regular"
              style={{ flex: 1 }}
              intensity={isMobile ? 0 : undefined}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    flexDirection: "column",
                    gap: 5,
                    padding: 15,
                  }}
                >
                  {chatHistory?.chats.map((c, idx) => {
                    return (
                      <FadeInView
                        key={c.id}
                        isAnimationDisabled={isAnimatedDoneState.index}
                        delay={idx * 150}
                      >
                        <ChatSummary
                          chatId={c.id}
                          title={c.title}
                          message={c.lastMessage}
                        />
                      </FadeInView>
                    );
                  })}
                </View>
              </ScrollView>
            </BlurView>
          </Rounded>
        </FadeInView>
      </Container>
    </ChatFrame>
  );
}
