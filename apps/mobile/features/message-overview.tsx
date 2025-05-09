import { styled } from "styled-components/native";

import { Pressable, PressableProps, View } from "react-native";

import { Text } from "@/components/text";

import { sky800, zinc100, zinc600 } from "@/constants/theme";
import { ChatCircleDots } from "phosphor-react-native";
import { isWeb } from "@/constants/platform";
import { Rounded } from "@/components/rounded";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";

const MessageOverviewBox = styled(Rounded)`
  border: 1px solid ${zinc100};
  overflow: hidden;
`;

export const MessageOverview = ({
  style,
}: {
  style?: PressableProps["style"];
}) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        router.push("/chat/12");
      }}
      style={style}
    >
      <MessageOverviewBox>
        <View
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "#fff",
            opacity: isWeb ? 0.5 : 0.2,
          }}
        />

        <BlurView
          intensity={20}
          style={{
            backgroundColor: "#ffffff" + "80",
            padding: 20,
          }}
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
        </BlurView>
      </MessageOverviewBox>
    </Pressable>
  );
};
