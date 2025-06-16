import { Pressable, View } from "react-native";
import { DescriptionPreview } from "./description-preview";
import { Rounded } from "@/components/rounded";
import { LinearGradient } from "expo-linear-gradient";
import { useUserSettings } from "@/hooks/use-user-settings";
import { BlurView } from "expo-blur";
import * as Clipboard from "expo-clipboard";

import { AnimatedText, Text } from "@/components/text";
import { Button } from "@/components/button";
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  GithubLogo,
  Globe,
  LinkedinLogo,
  LinkSimple,
  Snowflake,
  Sun,
  XLogo,
} from "phosphor-react-native";
import {
  UserOverviewQueryOutput,
  useUserWeatherPublicQuery,
  useUserWeatherQuery,
} from "@/queries/users";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useAuth } from "@clerk/clerk-expo";
import { Link, useLocalSearchParams } from "expo-router";
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { isWeb } from "@/constants/platform";

const WeatherIcon = ({ code, color }: { code: string; color: string }) => {
  const Component = {
    "01": Sun,
    "02": CloudSun,
    "03": Cloud,
    "04": Cloud,
    "09": CloudRain,
    "10": CloudRain,
    "11": CloudLightning,
    "12": Snowflake,
    "50": CloudFog,
  }[code.slice(0, 2)];

  return Component ? (
    <Component size={40} weight="duotone" duotoneColor={color} />
  ) : null;
};

const SlideInText = ({
  text,
  fontSize,
  delay = 0,
}: {
  text: string;
  fontSize?: "2xl";
  delay?: number;
}) => {
  const x = useSharedValue(-250);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }],
    };
  });

  useEffect(() => {
    x.value = withDelay(delay, withTiming(0, { duration: 500 }));
  }, []);

  return (
    <AnimatedText style={animatedStyle} fontSize={fontSize}>
      {text}
    </AnimatedText>
  );
};

export const UserSummary = ({
  summary,
  onDescriptionPress,
}: {
  summary?: UserOverviewQueryOutput;
  onDescriptionPress?: () => void;
}) => {
  const userSettings = useUserSettings();

  const params = useLocalSearchParams<{ username: string }>();

  const { isSignedIn } = useAuth();

  //#region weather
  const userWeatherPublicQuery = useUserWeatherPublicQuery(
    {
      username: params.username!,
    },
    { enabled: !isSignedIn && !!params.username }
  );

  const userWeatherQuery = useUserWeatherQuery(undefined, {
    enabled: isSignedIn,
  });

  const userWeatherPublic = userWeatherPublicQuery.data;
  const userWeather = userWeatherQuery.data;
  //#endregion

  const [date] = useState(() => DateTime.now());

  const isWeatherPending = isSignedIn
    ? userWeatherQuery.isPending
    : userWeatherPublicQuery.isPending;

  return (
    <View style={{ gap: 10, flexDirection: "row", height: 450 }}>
      <Pressable style={{ flex: 1.5 }} onPress={onDescriptionPress}>
        <DescriptionPreview description={summary?.description ?? ""} />
      </Pressable>
      <View style={{ flexDirection: "column", gap: 10, flex: 1 }}>
        <Rounded
          style={{
            flex: 1,
            backgroundColor: "#fff",
            padding: 25,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{ overflow: "hidden", flexDirection: "column", gap: 10 }}
          >
            {!isWeatherPending ? (
              <>
                <SlideInText text={userWeather?.regionName ?? "Somewhere"} />
                <SlideInText
                  fontSize="2xl"
                  delay={150}
                  text={`${userWeather?.temperature ?? userWeatherPublic?.temperature}°C`}
                />
              </>
            ) : null}
          </View>

          <WeatherIcon
            code={userWeather?.icon ?? userWeatherPublic?.icon ?? "01d"}
            color={userSettings.colorSettings["base"]}
          />
        </Rounded>
        <Rounded
          style={{
            flex: 1,
            overflow: "hidden",
          }}
        >
          <LinearGradient
            colors={[
              userSettings.colorSettings[100],
              userSettings.colorSettings[700],
            ]}
            style={{ height: "100%" }}
          >
            <BlurView
              style={{
                height: "100%",
                padding: 25,
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              intensity={100}
              tint="dark"
            >
              <Text style={{ color: "#fff" }}>
                {date.toFormat("dd LLLL")}
                {"\n"}
                {date.toFormat("cccc")}
              </Text>
              <Text fontSize="lg" style={{ color: "#fff" }}>
                {date.toFormat(" t a")}
              </Text>
            </BlurView>
          </LinearGradient>
        </Rounded>
        <Rounded
          style={{ overflow: "hidden", backgroundColor: "#ffffff" + "d6" }}
        >
          <BlurView
            tint="prominent"
            style={{
              paddingHorizontal: 25,
              paddingVertical: 15,
              flexDirection: "row",
              gap: 5,
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", gap: 5 }}>
              {summary?.social?.x ? (
                <Link
                  href={summary.social.x}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Button
                    variant="filled"
                    borderColor={"#5b5b5b" + "cc"}
                    padding={{ horizontal: 12, vertical: 8 }}
                  >
                    <XLogo
                      size={18}
                      color="#fff"
                      style={{ transform: [{ translateY: 5 }] }}
                    />
                  </Button>
                </Link>
              ) : null}

              {summary?.social?.github ? (
                <Link
                  href={summary.social.github}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Button
                    variant="filled"
                    borderColor={"#5b5b5b" + "cc"}
                    padding={{ horizontal: 12, vertical: 8 }}
                  >
                    <GithubLogo
                      size={18}
                      color="#fff"
                      style={{ transform: [{ translateY: 5 }] }}
                    />
                  </Button>
                </Link>
              ) : null}

              {summary?.social?.linkedin ? (
                <Link
                  href={summary.social.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Button
                    variant="filled"
                    borderColor={"#5b5b5b" + "cc"}
                    padding={{ horizontal: 12, vertical: 8 }}
                  >
                    <LinkedinLogo
                      size={18}
                      color="#fff"
                      style={{ transform: [{ translateY: 5 }] }}
                    />
                  </Button>
                </Link>
              ) : null}

              {summary?.social?.website ? (
                <Link
                  href={summary.social.website}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Button
                    variant="filled"
                    borderColor={"#5b5b5b" + "cc"}
                    padding={{ horizontal: 12, vertical: 8 }}
                  >
                    <Globe
                      size={18}
                      color="#fff"
                      style={{ transform: [{ translateY: 5 }] }}
                    />
                  </Button>
                </Link>
              ) : null}
            </View>
            <Button
              variant="filled"
              borderColor={"#5b5b5b" + "cc"}
              padding={{ horizontal: 12, vertical: 8 }}
              onPress={async () => {
                if (isWeb) {
                  await Clipboard.setStringAsync(window.location.href);
                }
              }}
            >
              <LinkSimple
                size={18}
                color="#fff"
                style={{ transform: [{ translateY: 5 }] }}
              />
            </Button>
          </BlurView>
        </Rounded>
      </View>
    </View>
  );
};
