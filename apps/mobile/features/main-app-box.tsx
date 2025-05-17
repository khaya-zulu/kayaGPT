import "react-native-reanimated";
import { Fragment, ReactNode } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  PressableProps,
  SafeAreaView,
  TextInputProps,
  View,
} from "react-native";

import { styled } from "styled-components/native";

import { BackgroundImageFeature } from "@/features/background-image";
import { ChatBox } from "@/features/chat-box";

import { isIOS, isWeb } from "@/constants/platform";

export const MainAppBox = ({
  children,
  backgroundStyle,
}: {
  children: ReactNode;
  backgroundStyle?: { opacity?: number; intensity?: number };
}) => {
  return (
    <ImageBackground
      style={{
        flex: 1,
        backgroundColor: "#fff",
        width: "100%",
      }}
      // source={require("../assets/images/workspace.png")}
      source={{
        uri: "http://localhost:8787/api/workspace/sxrmqobrfiq2e76en6su4t49",
      }}
      resizeMode="cover"
    >
      <BackgroundImageFeature
        opacity={backgroundStyle?.opacity}
        intensity={backgroundStyle?.intensity}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={isIOS ? "padding" : "position"}
      >
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export const ChatMessageFrame = styled.View`
  max-width: 600px;
  margin: auto;
  flex: 1;
  padding: 10px;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export const ChatFrame = ({
  children,
  isSafeAreaDisabled,
  value,
  onChange,
  onSubmit,
  toolbar,
}: {
  children: ReactNode;
  isSafeAreaDisabled?: boolean;
  value: string;
  onChange: TextInputProps["onChange"];
  onSubmit: PressableProps["onPress"];
  toolbar?: ReactNode;
}) => {
  const Component = isSafeAreaDisabled ? Fragment : SafeAreaView;
  const props = isSafeAreaDisabled ? {} : { style: { flex: 1 } };

  return (
    <MainAppBox>
      <View
        style={{
          flex: 1,
          padding: isWeb ? 20 : 0,
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Component {...props}>{children}</Component>
        <ChatBox
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          toolbar={toolbar}
        />
      </View>
    </MainAppBox>
  );
};
