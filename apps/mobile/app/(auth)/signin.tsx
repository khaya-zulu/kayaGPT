import { GoogleLogo } from "phosphor-react-native";
import { Image, SafeAreaView, View } from "react-native";

import { MainAppBox } from "@/features/main-app-box";
import { ChatMessage } from "@/features/chat-message";

import { Button } from "@/components/button";
import { Text } from "@/components/text";
import { useAuth, useSSO } from "@clerk/clerk-expo";
import { Link, Redirect, useRouter } from "expo-router";
import { Rounded } from "@/components/rounded";
import { zinc300, zinc500 } from "@/constants/theme";
import { useUserRandomQuery } from "@/queries/users";
import { useMobile } from "@/hooks/use-mobile";
import { AnimatedView } from "@/components/animated-view";
import { Keyframe } from "react-native-reanimated";
import { isWeb } from "@/constants/platform";

const SignInAction = () => {
  const { startSSOFlow } = useSSO();

  const router = useRouter();

  //#region sign in with Google
  const signInWithGoogle = async () => {
    await startSSOFlow({
      strategy: "oauth_google",
    });

    if (isWeb) {
      // context: the session state is not updated immediately in web,
      // so we need to reload the page
      window.location.reload();
    } else {
      router.navigate("/");
    }
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

const keyframe = new Keyframe({
  "0": {
    transform: [{ rotate: "10deg" }, { scale: 0.2 }, { translateX: 10 }],
  },
  100: {
    transform: [{ rotate: "0deg" }, { scale: 1 }, { translateX: 0 }],
  },
});

const AnimatedWorkspaceImage = ({ username }: { username?: string }) => {
  return (
    <Link href={`/${username}`}>
      <AnimatedView entering={keyframe.duration(300).delay(350)}>
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
                uri: `${process.env.EXPO_PUBLIC_API_URL}/img/workspace/${username}`,
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
      </AnimatedView>
    </Link>
  );
};

export default function SignInPage() {
  const { isSignedIn } = useAuth();

  const userRandomQuery = useUserRandomQuery();

  const userRandom = userRandomQuery.data;

  const { isMobile } = useMobile();

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <MainAppBox>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            maxWidth: 1200,
            width: "100%",
            margin: "auto",
          }}
        >
          <View
            style={{
              maxWidth: 500,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              width: "100%",
            }}
          >
            <View style={{ flex: 1 }}>
              <ChatMessage
                messageId="sign-in-message"
                role="Assistant"
                title={
                  <Text>
                    <Text style={{ color: zinc500 }}>kaya</Text>GPT
                  </Text>
                }
                parts={[
                  {
                    text: `Hello Human 🤖 [booting up...]\n\nThis is a project exploring universal AI applications with Expo — built by [upshot.dev](https://upshot.dev/). Read the [blog post](https://upshot.dev/notes/kayagpt). ${userRandom ? `Check out this random [workspace](/${userRandom?.username}):` : ""}`,
                    type: "text",
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    height: 150,
                  }}
                >
                  <View style={{ transform: [{ translateY: -10 }] }}>
                    <SignInAction />
                  </View>

                  {userRandom && !isMobile ? (
                    <AnimatedWorkspaceImage username={userRandom.username} />
                  ) : null}
                </View>
              </ChatMessage>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </MainAppBox>
  );
}
