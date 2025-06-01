import { Keyboard, ScrollView, View } from "react-native";
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
import { isWeb } from "@/constants/platform";
import { NavigationMenu } from "@/features/navigation-menu";
import { DateNow } from "@/features/date-now";

const Container = styled.Pressable`
  max-width: 512px;
  margin: 0 auto;
  width: 100%;
  flex-direction: column;
  gap: ${isWeb ? "10px" : "0px"};
  flex: 1;
`;

export default function IndexPage() {
  const router = useRouter();

  const { isSignedIn } = useAuth();
  const { handleInputChange, input, setInput } = useChat({});

  const chatHistoryQuery = useChatHistoryQuery();

  if (!isSignedIn) {
    return <Redirect href="/signin" />;
  }

  return (
    <ChatFrame
      onChange={(ev) => {
        handleInputChange({
          ...ev,
          target: {
            ...ev.target,
            value: ev.nativeEvent.text,
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      }}
      value={input}
      onSubmit={() => {
        router.push(`/chat/${Crypto.randomUUID()}?message=${input}`);
        setInput("");
      }}
      bottomToolbar={<ChatBoxToolbar />}
      toolbar={<DateNow />}
    >
      <Container onPress={() => Keyboard.dismiss()}>
        <NavigationMenu />
        <Rounded
          size={isWeb ? "2xl" : 0}
          style={{
            flex: 1,
            width: "100%",
            overflow: "hidden",
            marginBottom: isWeb ? 15 : 0,
          }}
        >
          <BlurView
            tint="regular"
            style={{ flex: 1 }}
            intensity={isWeb ? undefined : 0}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  flexDirection: "column",
                  gap: 5,
                  padding: 15,
                }}
              >
                {chatHistoryQuery.data?.chats.map((c) => {
                  return (
                    <ChatSummary
                      key={c.id}
                      chatId={c.id}
                      title={c.title}
                      message={c.lastMessage}
                    />
                  );
                })}
              </View>
            </ScrollView>
          </BlurView>
        </Rounded>
      </Container>
    </ChatFrame>
  );
}
