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
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

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
  const { handleInputChange, input, setInput } = useChat({});

  const { isMobile } = useMobile();

  const chatHistoryQuery = useChatHistoryQuery();

  //#region chat form
  const handleChatFormSubmit = () => {
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
    >
      <Container onPress={() => Keyboard.dismiss()} isMobile={isMobile}>
        <Animated.View entering={FadeIn.duration(250).delay(250)}>
          <NavigationMenu />
        </Animated.View>
        <Animated.View
          style={{ flex: 1 }}
          entering={FadeInUp.duration(250).delay(150)}
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
                  {chatHistoryQuery.data?.chats.map((c, idx) => {
                    return (
                      <Animated.View
                        key={c.id}
                        entering={FadeIn.duration(350).delay(idx * 150)}
                      >
                        <ChatSummary
                          chatId={c.id}
                          title={c.title}
                          message={c.lastMessage}
                        />
                      </Animated.View>
                    );
                  })}
                </View>
              </ScrollView>
            </BlurView>
          </Rounded>
        </Animated.View>
      </Container>
    </ChatFrame>
  );
}
