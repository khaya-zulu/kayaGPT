import { GoogleLogo } from "phosphor-react-native";
import { Image, SafeAreaView, View } from "react-native";

import { MainAppBox } from "@/features/main-app-box";
import { ChatMessage } from "@/features/chat-message";

import { Button } from "@/components/button";
import { Text } from "@/components/text";
import { useSSO } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Rounded } from "@/components/rounded";
import { zinc300 } from "@/constants/theme";
import { useUserRandomQuery } from "@/queries/users";
import { useMobile } from "@/hooks/use-mobile";

const SignInAction = () => {
  const { startSSOFlow } = useSSO();

  const router = useRouter();

  //#region sign in with Google
  const signInWithGoogle = async () => {
    await startSSOFlow({
      strategy: "oauth_google",
    });

    router.navigate("/");
  };
  //#endregion

  return (
    <View style={{ flexDirection: "row" }}>
      <Button
        padding={{ horizontal: 0 }}
        variant="filled"
        onPress={signInWithGoogle}
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
      </Button>
    </View>
  );
};

export default function SignInPage() {
  const userRandomQuery = useUserRandomQuery();

  const userRandom = userRandomQuery.data;

  const { isMobile } = useMobile();

  return (
    <MainAppBox>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            maxWidth: 500,
            margin: "auto",
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            width: "100%",
          }}
        >
          <View style={{ flex: 1 }}>
            <ChatMessage
              role="Assistant"
              messageId="Login"
              parts={[
                {
                  text: "Hello Human 👋, booting up...\n\nI'm Khaya, as I explore LLMs and building universal apps with Expo. Here is a workspace:",
                  type: "text",
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ transform: [{ translateY: -10 }] }}>
                  <SignInAction />
                </View>

                {userRandom && !isMobile ? (
                  <Link href={`/${userRandom.username}`}>
                    <Rounded
                      size="2xl"
                      style={{
                        padding: 5,
                        backgroundColor: "#ffffff",
                        transform: [{ rotate: "5deg" }],
                      }}
                    >
                      <Rounded size={13} style={{ overflow: "hidden" }}>
                        <Image
                          source={{
                            uri: `${process.env.EXPO_PUBLIC_API_URL}/img/workspace/${userRandom.username}`,
                          }}
                          style={{
                            height: 125,
                            width: 125,
                            borderWidth: 1,
                            borderColor: zinc300,
                          }}
                        />
                      </Rounded>
                    </Rounded>
                  </Link>
                ) : null}
              </View>
            </ChatMessage>
          </View>
        </View>
      </SafeAreaView>
    </MainAppBox>
  );
}
