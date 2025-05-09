import "react-native-reanimated";
import { Fragment, ReactNode } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  View,
} from "react-native";
import { BackgroundImageFeature } from "@/features/background-image";

import { isIOS, isWeb } from "@/constants/platform";
import { InputBoxFeature } from "./index";

import { useChat } from "@ai-sdk/react";
import { fetch as expoFetch } from "expo/fetch";

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
  isSafeAreaDisabled,
}: {
  children: ReactNode;
  isSafeAreaDisabled?: boolean;
}) => {
  const { handleSubmit, handleInputChange, input } = useChat({
    api: "http://localhost:8787/api/chat",
    fetch: expoFetch as unknown as typeof fetch,
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const Component = isSafeAreaDisabled ? Fragment : SafeAreaView;
  const props = isSafeAreaDisabled ? {} : { style: { flex: 1 } };

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
        <Component {...props}>{children}</Component>
        <InputBoxFeature
          value={input}
          onChange={(ev) => {
            handleInputChange({
              ...ev,
              target: {
                ...ev.target,
                value: ev.nativeEvent.text,
              },
            } as unknown as React.ChangeEvent<HTMLInputElement>);
          }}
          onSubmit={(e) => {
            handleSubmit(e);
            e.preventDefault();
          }}
        />
      </View>
    </MainContainerFeature>
  );
};
