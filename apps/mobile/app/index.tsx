import { Keyboard, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { styled } from "styled-components/native";

import * as Crypto from "expo-crypto";

import { Text } from "@/components/text";

import { rounded2xl, zinc400 } from "@/constants/theme";
import { ChatFrame } from "@/features/main-app-box";
import { isWeb } from "@/constants/platform";
import { Rounded } from "@/components/rounded";
import { MessageTags } from "@/features/message-tags";

import { MessageOverview } from "@/features/message-overview";
import { useChat } from "@/hooks/use-chat";
import { useChatHistoryQuery } from "@/queries/chat";
import { ChatBoxToolbar } from "@/features/chat-box/toolbar";
import { useUserSettings } from "@/hooks/use-user-settings";

// todo: this should only be a button on mobile
const Container = styled.Pressable`
  max-width: 512px;
  margin: 0 auto;
  width: 100%;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;

const WorkspaceImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: ${rounded2xl};
  margin-left: 20px;
  transform: rotate(-8deg) translateY(-10px);
  z-index: 20;
  /* todo: make this transparent with some kind of mask */
  border-color: #fff;
  border-width: 4px;
`;

const AvatarImage = styled.Image`
  width: 75px;
  height: 75px;
  border-radius: ${rounded2xl};
  margin-left: 20px;
  transform: translateX(-50px) translateY(10px) rotate(4deg);
`;

const padding = isWeb ? 0 : 20;

const MessageOverviewBox = styled(Rounded)`
  flex-direction: column;
  gap: 8;
  padding: ${isWeb ? 0 : padding}px ${isWeb ? 0 : 10}px 0px;
  flex: 1;
  border: ${!isWeb ? "1px" : "0px"} solid ${zinc400 + "80"};
  border-bottom-color: transparent;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`;

export default function IndexPage() {
  const router = useRouter();
  const userSettings = useUserSettings();

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
        <View
          style={{
            position: "relative",
            paddingTop: padding,
            paddingHorizontal: padding,
            marginBottom: isWeb ? 10 : 5,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Link href="/profile">
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <WorkspaceImage
                source={{
                  uri: userSettings.workspaceUrl,
                }}
              />
              <AvatarImage
                source={{
                  uri: "http://localhost:8787/api/user/profile/sxrmqobrfiq2e76en6su4t49",
                }}
              />
            </View>
          </Link>
          <View>
            <Text style={{ marginLeft: "auto" }}>Hi Khaya 👋</Text>
            <Text>18:58 PM, 22°C</Text>
          </View>
        </View>
        <MessageOverviewBox>
          {!isWeb ? (
            <>
              <MessageTags />
              <View style={{ height: 4 }} />
            </>
          ) : null}

          {chatHistoryQuery.data?.chats.map((c) => {
            return (
              <MessageOverview
                key={c.id}
                chatId={c.id}
                title={c.title}
                message={c.lastMessage}
              />
            );
          })}
        </MessageOverviewBox>
      </Container>
    </ChatFrame>
  );
}
