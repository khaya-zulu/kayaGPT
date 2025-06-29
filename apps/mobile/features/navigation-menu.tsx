import { View, Pressable, SafeAreaView } from "react-native";
import { Link, LinkProps, useRouter } from "expo-router";

import { AnimatedText, Text } from "@/components/text";

import { rose600, zinc200, zinc300 } from "@/constants/theme";
import { Rounded } from "@/components/rounded";

import { useUserSettings } from "@/hooks/use-user-settings";
import { Laptop, SignOut, Television, UserCircle } from "phosphor-react-native";
import { BlurView } from "expo-blur";
import { ReactNode } from "react";
import { Button } from "@/components/button";
import { useUserWeatherQuery } from "@/queries/users";
import { useAuth } from "@clerk/clerk-expo";
import { useMobile } from "@/hooks/use-mobile";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

const NavigationMenuItem = ({
  icon,
  to,
}: {
  icon: ReactNode;
  to: LinkProps["href"];
}) => {
  return (
    <Link href={to} style={{ flex: 1 }}>
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 5,
          height: "100%",
          position: "relative",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        <Rounded
          style={{
            backgroundColor: "#ffffff",
            padding: 5,
            borderColor: zinc200 + "cc",
            borderWidth: 1,
          }}
        >
          {icon}
        </Rounded>
      </View>
    </Link>
  );
};

const WeatherComment = ({ text }: { text: string }) => {
  const words = text.split(" ");

  return (
    <Rounded
      style={{
        backgroundColor: "#ffffff",
        paddingHorizontal: 15,
        paddingVertical: 15,
        flexDirection: "column",
        gap: 5,
        flex: 1,
        height: 79,
      }}
    >
      <Text numberOfLines={2} fontSize="sm">
        {words.map((word, idx) => (
          <AnimatedText
            fontSize="sm"
            key={"word" + word + idx}
            entering={FadeInDown.duration(350).delay(idx * 50)}
          >
            {word + " "}
          </AnimatedText>
        ))}
      </Text>
    </Rounded>
  );
};

const WebNavigationMenuItem = () => {
  const userSettings = useUserSettings();
  const userWeatherQuery = useUserWeatherQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { navigate } = useRouter();
  const { signOut } = useAuth();

  const userWeather = userWeatherQuery.data;

  const handleSignOut = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <View>
      <Rounded
        size={25}
        style={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        <BlurView
          style={{
            padding: 15,
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            gap: 5,
            height: "100%",
          }}
          tint="regular"
        >
          <Rounded
            style={{
              backgroundColor: "#ffffff",
              flexDirection: "row",
              borderWidth: 2,
              borderColor: zinc300,
              justifyContent: "space-between",
            }}
          >
            <NavigationMenuItem
              icon={<Laptop size={16} weight="bold" />}
              to="/profile/workspace"
            />

            <View style={{ width: 1, backgroundColor: zinc200 + "cc" }} />

            <NavigationMenuItem
              icon={<Television size={16} weight="bold" />}
              to={`/${userSettings.username}`}
            />

            <View style={{ width: 1, backgroundColor: zinc200 + "cc" }} />

            <Pressable
              style={{
                paddingVertical: 10,
                paddingHorizontal: 5,
                height: "100%",
                position: "relative",
                flexDirection: "row",
                alignItems: "flex-end",
              }}
              onPress={handleSignOut}
            >
              <Rounded
                style={{
                  backgroundColor: "#ffffff",
                  padding: 5,
                  borderColor: zinc200 + "cc",
                  borderWidth: 1,
                }}
              >
                <SignOut size={16} weight="bold" color={rose600} />
              </Rounded>
            </Pressable>
          </Rounded>
          <WeatherComment text={userWeather?.comment ?? ""} />
        </BlurView>
      </Rounded>
    </View>
  );
};

export const MobileNavigationMenuItem = () => {
  const userSettings = useUserSettings();

  const borderColor = userSettings.colorSettings[100] + "80";

  return (
    <SafeAreaView
      style={{
        flexDirection: "row",
        marginHorizontal: 15,
        justifyContent: "center",
      }}
    >
      <Button style={{ padding: 0 }} rounded="2xl" variant="white">
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <View
            style={{
              paddingVertical: 8,
              paddingHorizontal: 15,
              borderRightColor: borderColor,
              borderRightWidth: 1,
            }}
          >
            <Text fontSize="sm">Hi 👋</Text>
          </View>
          <Pressable style={{ padding: 8 }}>
            <UserCircle size={20} />
          </Pressable>
          <Pressable
            style={{
              padding: 8,
              borderLeftColor: borderColor,
              borderLeftWidth: 1,
              borderRightColor: borderColor,
              borderRightWidth: 1,
              height: "100%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Laptop size={18} />
          </Pressable>
          <Pressable style={{ padding: 8 }}>
            <Television size={18} />
          </Pressable>
        </View>
      </Button>
    </SafeAreaView>
  );
};

export const NavigationMenu = () => {
  const { isMobile } = useMobile();

  if (isMobile) {
    return <MobileNavigationMenuItem />;
  }

  return <WebNavigationMenuItem />;
};
