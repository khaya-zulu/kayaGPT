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
import { BackgroundImageFeature } from "@/features/background-image";

import { isIOS, isWeb } from "@/constants/platform";
import { InputBoxFeature } from "./index/index";

import { useChat } from "@ai-sdk/react";
import { fetch as expoFetch } from "expo/fetch";

export const MainAppBox = ({ children }: { children: ReactNode }) => {
  return (
    <ImageBackground
      style={{
        flex: 1,
        backgroundColor: "#fff",
        width: "100%",
      }}
      source={require("../assets/images/workspace.png")}
      resizeMode="cover"
    >
      <BackgroundImageFeature />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={isIOS ? "padding" : "position"}
      >
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export const BoxWithChat = ({
  children,
  isSafeAreaDisabled,
  value,
  onChange,
  onSubmit,
}: {
  children: ReactNode;
  isSafeAreaDisabled?: boolean;
  value: string;
  onChange: TextInputProps["onChange"];
  onSubmit: PressableProps["onPress"];
}) => {
  const Component = isSafeAreaDisabled ? Fragment : SafeAreaView;
  const props = isSafeAreaDisabled ? {} : { style: { flex: 1 } };

  return (
    <MainAppBox>
      <View
        style={{
          flex: 1,
          padding: isWeb ? 40 : 0,
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Component {...props}>{children}</Component>
        <InputBoxFeature
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      </View>
    </MainAppBox>
  );
};
