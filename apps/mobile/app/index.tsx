import { Keyboard, View } from "react-native";
import { useRouter } from "expo-router";
import { styled } from "styled-components/native";

import * as Crypto from "expo-crypto";

import { Text } from "@/components/text";

import { rounded2xl, zinc400 } from "@/constants/theme";
import { BoxWithChat } from "@/features/main-app-box";
import { isWeb } from "@/constants/platform";
import { Rounded } from "@/components/rounded";
import { MessageTags } from "@/features/message-tags";

import { MessageOverview } from "@/features/message-overview";
import { useChat } from "@/hooks/use-chat";
import { useChatHistoryQuery } from "@/queries/chat";

// todo: this should only be a button on mobile
const Container = styled.Pressable`
  max-width: 512;
  margin: 0 auto;
  width: 100%;
  flex-direction: column;
  gap: 20;
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

  const { handleInputChange, input, setInput } = useChat({});

  const chatHistoryQuery = useChatHistoryQuery();

  return (
    <BoxWithChat
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
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <WorkspaceImage
              source={require("../assets/images/workspace.png")}
            />
            <AvatarImage
              source={{
                uri: "https://pbs.twimg.com/profile_images/1830330700920201220/tQz0-0Xq_400x400.jpg",
              }}
            />
          </View>
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

          {chatHistoryQuery.data?.chats.map((c, idx) => {
            return (
              <MessageOverview
                key={c.id}
                style={{ transform: [{ translateY: -idx * 20 }] }}
                title={c.title}
                message={c.lastMessage}
              />
            );
          })}
        </MessageOverviewBox>
      </Container>
    </BoxWithChat>
  );
}
