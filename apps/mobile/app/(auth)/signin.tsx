import { GoogleLogo } from "phosphor-react-native";
import { SafeAreaView, View } from "react-native";

import { MainAppBox } from "@/features/main-app-box";
import { ChatMessage } from "@/features/chat-message";

import { Pill } from "@/components/button";
import { Text } from "@/components/text";
import { useAuth, useSSO } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";

const SignInAction = () => {
  const { startSSOFlow } = useSSO();

  const router = useRouter();

  return (
    <View style={{ flexDirection: "row" }}>
      <Pill
        noText
        variant="filled"
        onPress={async () => {
          await startSSOFlow({
            strategy: "oauth_google",
          });

          router.push("/");
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
          <Text style={{ color: "#fff" }}>Login with Google</Text>
        </View>
      </Pill>
    </View>
  );
};

export default function SignInPage() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

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
            actions={<SignInAction />}
            role="Assistant"
            messageId="Login"
            parts={[{ text: "Hello Human 👋, booting up...", type: "text" }]}
          />
        </View>
      </SafeAreaView>
    </MainAppBox>
  );
}
