import "react-native-reanimated";
import { ReactNode } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  View,
} from "react-native";
import { BackgroundImageFeature } from "@/features/background-image";

import { isIOS, isWeb } from "@/constants/platform";
import { InputBoxFeature } from "./index";

export const MainContainerFeature = ({ children }: { children: ReactNode }) => {
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

export const ContainerWithChatFeature = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <MainContainerFeature>
      <View
        style={{
          flex: 1,
          padding: isWeb ? 40 : 0,
          flexDirection: "column",
          position: "relative",
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>

        <InputBoxFeature />
      </View>
    </MainContainerFeature>
  );
};
