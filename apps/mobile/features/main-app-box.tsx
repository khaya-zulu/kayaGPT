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

import { isIOS } from "@/constants/platform";
import { useUserSettings } from "@/hooks/use-user-settings";
import { useMobile } from "@/hooks/use-mobile";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { AnimatedView } from "@/components/animated-view";

export const MainAppBox = ({
  children,
  backgroundStyle,
}: {
  children: ReactNode;
  backgroundStyle?: { opacity?: number; intensity?: number };
}) => {
  const userSettings = useUserSettings();
  return (
    <ImageBackground
      style={{
        flex: 1,
        backgroundColor: "#fff",
        width: "100%",
      }}
      // source={require("../assets/images/workspace.png")}
      source={{
        uri: userSettings.workspaceUrl,
      }}
      resizeMode="cover"
    >
      <BackgroundImageFeature
        opacity={backgroundStyle?.opacity ?? 0.3}
        intensity={backgroundStyle?.intensity ?? 20}
        color={userSettings.colorSettings[800]}
      />
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: "row" }}
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
  bottomToolbar,
  rightLayout,
  scrollProgress,
  isChatAnimationDisabled = false,
}: {
  children: ReactNode;
  isSafeAreaDisabled?: boolean;
  value: string;
  onChange: TextInputProps["onChange"];
  onSubmit: PressableProps["onPress"];
  toolbar?: ReactNode;
  bottomToolbar?: ReactNode;
  rightLayout?: ReactNode;
  scrollProgress?: number;
  isChatAnimationDisabled?: boolean;
}) => {
  const Component = isSafeAreaDisabled ? Fragment : SafeAreaView;
  const props = isSafeAreaDisabled ? {} : { style: { flex: 1 } };

  const { isMobile } = useMobile();

  return (
    <MainAppBox backgroundStyle={{ opacity: 0.3, intensity: 20 }}>
      <View
        style={{
          flex: 1,
          padding: isMobile ? 0 : 20,
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Component {...props}>{children}</Component>
        <AnimatedView
          isAnimationDisabled={isChatAnimationDisabled}
          entering={FadeInDown.duration(250)}
        >
          <ChatBox
            value={value}
            onChange={onChange}
            onSubmit={onSubmit}
            toolbar={toolbar}
            bottomToolbar={bottomToolbar}
            scrollProgress={scrollProgress}
          />
        </AnimatedView>
      </View>
      {rightLayout}
    </MainAppBox>
  );
};
