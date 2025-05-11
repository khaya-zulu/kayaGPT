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
import { ChatBox } from "@/features/chat-box";

import { isIOS, isWeb } from "@/constants/platform";

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
