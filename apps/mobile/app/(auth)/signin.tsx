import { GoogleLogo } from "phosphor-react-native";
import { SafeAreaView, View } from "react-native";

import { MainAppBox } from "@/features/main-app-box";
import { ChatMessage } from "@/features/chat-message";

import { Pill } from "@/components/pill";
import { Text } from "@/components/text";
import { useSignUp, useSSO } from "@clerk/clerk-expo";

const SignInAction = () => {
  const { startSSOFlow } = useSSO();

  return (
    <View style={{ flexDirection: "row" }}>
      <Pill
        noText
        variant="filled"
        onPress={async () => {
          await startSSOFlow({
            strategy: "oauth_google",
          });
        }}
      >
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <GoogleLogo color="#fff" size={18} />
          <Text style={{ color: "#fff" }}>Continue with Google</Text>
        </View>
      </Pill>
    </View>
  );
};

export default function SignInPage() {
  return (
    <MainAppBox>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            maxWidth: 400,
            margin: "auto",
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            width: "100%",
          }}
        >
          <ChatMessage
            content="Hello Human 👋, booting up..."
            actions={<SignInAction />}
            role="Assistant"
            messageId="Login"
          />
        </View>
      </SafeAreaView>
    </MainAppBox>
  );
}
