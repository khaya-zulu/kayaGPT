import { Keyboard, View } from "react-native";
import { Link, LinkProps, useRouter } from "expo-router";
import { styled } from "styled-components/native";

import * as Crypto from "expo-crypto";

import { Text } from "@/components/text";

import { zinc200, zinc300 } from "@/constants/theme";
import { ChatFrame } from "@/features/main-app-box";
import { Rounded } from "@/components/rounded";

import { ChatSummary } from "@/features/chat-summary";
import { useChat } from "@/hooks/use-chat";
import { useChatHistoryQuery } from "@/queries/chat";
import { ChatBoxToolbar } from "@/features/chat-box/toolbar";
import { useUserSettings } from "@/hooks/use-user-settings";
import { Laptop, Television, User } from "phosphor-react-native";
import { BlurView } from "expo-blur";
import { ReactNode } from "react";

// todo: this should only be a button on mobile
const Container = styled.Pressable`
  max-width: 512px;
  margin: 0 auto;
  width: 100%;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;

const NavigationMenuItem = ({
  icon,
  to,
}: {
  icon: ReactNode;
  to: LinkProps["href"];
}) => {
  return (
    <Link href={to} style={{ flex: 1 }}>
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 5,
          height: "100%",
          position: "relative",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        <Rounded
          style={{
            backgroundColor: "#ffffff",
            padding: 5,
            borderColor: zinc200 + "cc",
            borderWidth: 2,
          }}
        >
          {icon}
        </Rounded>
      </View>
    </Link>
  );
};

const BottomHalf = () => {
  const userSettings = useUserSettings();

  return (
    <View>
      <Rounded
        style={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        <BlurView
          style={{
            padding: 8,
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            gap: 5,
            height: "100%",
          }}
          tint="prominent"
        >
          <Rounded
            style={{
              backgroundColor: "#ffffff",
              flexDirection: "row",
              borderWidth: 2,
              borderColor: zinc300,
              justifyContent: "space-between",
            }}
          >
            <NavigationMenuItem
              icon={<User size={16} weight="bold" />}
              to="/profile"
            />
            <View style={{ width: 1, backgroundColor: zinc200 + "cc" }} />

            <NavigationMenuItem
              icon={<Laptop size={16} weight="bold" />}
              to="/profile/workspace"
            />

            <View style={{ width: 1, backgroundColor: zinc200 + "cc" }} />

            <NavigationMenuItem
              icon={<Television size={16} weight="bold" />}
              to="/space/kaya-was-taken"
            />
          </Rounded>
          <Rounded
            style={{
              backgroundColor: "#ffffff",
              paddingHorizontal: 15,
              paddingVertical: 15,
              flexDirection: "column",
              gap: 5,
              flex: 1,
            }}
          >
            <Text fontSize="sm">Hi Khaya 👋</Text>
            <Text fontSize="sm">
              It's a bit cloudy today, but the weather is nice.{" "}
              <Text style={{ color: userSettings.colorSettings["base"] }}>
                22°C
              </Text>
            </Text>
          </Rounded>
        </BlurView>
      </Rounded>
    </View>
  );
};

export default function IndexPage() {
  const router = useRouter();

  const { handleInputChange, input, setInput } = useChat({});

  const chatHistoryQuery = useChatHistoryQuery();

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
      toolbar={<ChatBoxToolbar />}
    >
      <Container onPress={() => Keyboard.dismiss()}>
        <BottomHalf />
        <Rounded
          style={{
            height: 500,
            width: "100%",
            overflow: "hidden",
          }}
        >
          <BlurView
            tint="prominent"
            style={{ flex: 1, padding: 15, flexDirection: "column", gap: 5 }}
          >
            {chatHistoryQuery.data?.chats.map((c, idx) => {
              return (
                <ChatSummary
                  key={c.id}
                  chatId={c.id}
                  title={c.title}
                  message={c.lastMessage}
                />
              );
            })}
          </BlurView>
        </Rounded>
      </Container>
    </ChatFrame>
  );
}
