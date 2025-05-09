import { styled } from "styled-components/native";

import { Keyboard, Pressable, View, SafeAreaView } from "react-native";

import { Text } from "@/components/text";

import { sky800, roundedLg, zinc200 } from "@/constants/theme";
import { ArrowLeft, ChatCircleDots, Cube } from "phosphor-react-native";
import { ContainerWithChatFeature } from "@/features/app-container";
import { ReactNode } from "react";
import { useRouter } from "expo-router";
import { isWeb } from "@/constants/platform";
import { BlurView } from "expo-blur";

// todo: this should only be a button on mobile
const Container = styled.Pressable`
  max-width: 512;
  margin: 0 auto;
  width: 100%;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;

const Message = ({
  role,
  children,
}: {
  role: "Assistant" | "User";
  children: ReactNode;
}) => {
  const textColor = role === "Assistant" ? sky800 : undefined;

  return (
    <View style={{ flexDirection: "row", gap: 15 }}>
      <Cube
        color={textColor}
        weight="duotone"
        size={20}
        style={{
          transform: [{ translateY: 2.5 }],
          opacity: role === "Assistant" ? 1 : 0,
        }}
        // flip x, todo: use for loading
        // style={{
        //   transform: [{ rotateY: "180deg" }],
        // }}
      />
      <Text style={{ color: textColor, flex: 1 }}>{children}</Text>
    </View>
  );
};

const ToolbarBox = styled.View`
  flex-direction: row;
  border: 1px solid ${zinc200 + "80"};
  border-top-color: transparent;
`;

export default function ChatIdPage() {
  const router = useRouter();

  return (
    <ContainerWithChatFeature isSafeAreaDisabled>
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
      <SafeAreaView style={{ flex: 1 }}>
        <Container onPress={() => Keyboard.dismiss()}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 20,
              flexDirection: "column",
              gap: 15,
            }}
          >
            <Message role="Assistant">How can I help you today?</Message>
            <Message role="User">Whats the weather in South Africa</Message>
          </View>
        </Container>
      </SafeAreaView>
    </ContainerWithChatFeature>
  );
}
