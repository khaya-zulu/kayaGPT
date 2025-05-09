import { styled } from "styled-components/native";

import { Keyboard, Pressable, PressableProps, View } from "react-native";

import { Text } from "@/components/text";

import {
  sky800,
  rounded2xl,
  zinc100,
  zinc600,
  zinc400,
} from "@/constants/theme";
import { ChatCircleDots } from "phosphor-react-native";
import { ContainerWithChatFeature } from "@/features/app-container";
import { isWeb } from "@/constants/platform";
import { Rounded } from "@/components/rounded";
import { MessageTags } from "@/features/message-tags";
import { useRouter } from "expo-router";

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

const ChatHistoryBox = styled(Rounded)`
  flex-direction: column;
  gap: 8;
  padding: ${isWeb ? 0 : padding}px ${isWeb ? 0 : 20}px 0px;
  flex: 1;
  border: ${!isWeb ? "1px" : "0px"} solid ${zinc400 + "80"};
  border-bottom-color: transparent;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`;

const MessageHistory = ({ style }: { style?: PressableProps["style"] }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        router.push("/chat/12");
      }}
      style={style}
    >
      <Rounded
        style={{
          backgroundColor: zinc100 + "80",
          padding: isWeb ? 4 : 0,
        }}
      >
        <Rounded
          style={{
            backgroundColor: "#fff",
            padding: 20,
          }}
          size={11}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginBottom: 10,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              <ChatCircleDots size={18} weight="bold" />
              <Text fontSize="sm">Hello world</Text>
            </View>

            <Text fontSize="sm" style={{ color: sky800 }}>
              12:00 PM
            </Text>
          </View>
          <Text fontSize="sm" numberOfLines={2}>
            AI:{" "}
            <Text style={{ color: zinc600 }}>
              Why is the world flat? and do I need to worry about it? I am not
              sure if I should be worried about it or not. I am not sure
            </Text>
          </Text>
        </Rounded>
      </Rounded>
    </Pressable>
  );
};

export default function IndexPage() {
  return (
    <ContainerWithChatFeature>
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
        <ChatHistoryBox>
          {!isWeb ? (
            <>
              <MessageTags />
              <View style={{ height: 4 }} />
            </>
          ) : null}

          <MessageHistory style={{ transform: [{ translateY: 10 }] }} />
          <MessageHistory style={{ transform: [{ translateY: -20 }] }} />
          <MessageHistory style={{ transform: [{ translateY: -50 }] }} />
        </ChatHistoryBox>
      </Container>
    </ContainerWithChatFeature>
  );
}
