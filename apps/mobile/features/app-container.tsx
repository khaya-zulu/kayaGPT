import "react-native-reanimated";
import { ReactNode } from "react";
import { ImageBackground, KeyboardAvoidingView } from "react-native";
import { BackgroundImageFeature } from "@/features/background-image";
import { SafeAreaView } from "react-native-safe-area-context";
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
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={isIOS ? "padding" : "position"}
        >
          {children}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};
