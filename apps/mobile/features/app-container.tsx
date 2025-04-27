import "react-native-reanimated";
import { ReactNode } from "react";
import { ImageBackground, KeyboardAvoidingView } from "react-native";
import { BackgroundImageFeature } from "@/features/background-image";

import { isIOS } from "@/constants/platform";

export const AppContainerFeature = ({ children }: { children: ReactNode }) => {
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
