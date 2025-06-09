import { Pressable, View } from "react-native";
import { DescriptionPreview } from "./description-preview";
import { Rounded } from "@/components/rounded";
import { LinearGradient } from "expo-linear-gradient";
import { useUserSettings } from "@/hooks/use-user-settings";
import { BlurView } from "expo-blur";

import { Text } from "@/components/text";
import { Pill } from "@/components/pill";
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
import { UserOverviewQueryOutput, useUserWeatherQuery } from "@/queries/users";
import { useState } from "react";
import { DateTime } from "luxon";

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

export const UserSummary = ({
  summary,
  onDescriptionPress,
}: {
  summary?: UserOverviewQueryOutput;
  onDescriptionPress?: () => void;
}) => {
  const userSettings = useUserSettings();
  const userWeatherQuery = useUserWeatherQuery();

  const userWeather = userWeatherQuery.data;

  const [date] = useState(() => DateTime.now());

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
          <View>
            <Text>{userWeather?.regionName}</Text>
            <Text fontSize="2xl" style={{ marginTop: 10 }}>
              {userWeather?.temperature}°C
            </Text>
          </View>

          <WeatherIcon
            code={userWeather?.icon ?? "01d"}
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
                <Pill variant="filled" borderColor={"#5b5b5b" + "cc"} noText>
                  <Text
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                    }}
                  >
                    <XLogo
                      size={18}
                      color="#fff"
                      style={{ transform: [{ translateY: 2 }] }}
                    />
                  </Text>
                </Pill>
              ) : null}

              {summary?.social?.github ? (
                <Pill variant="filled" borderColor={"#5b5b5b" + "cc"} noText>
                  <Text
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                    }}
                  >
                    <GithubLogo
                      size={18}
                      color="#fff"
                      style={{ transform: [{ translateY: 2 }] }}
                    />
                  </Text>
                </Pill>
              ) : null}

              {summary?.social?.linkedin ? (
                <Pill variant="filled" borderColor={"#5b5b5b" + "cc"} noText>
                  <Text
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                    }}
                  >
                    <LinkedinLogo
                      size={18}
                      color="#fff"
                      style={{ transform: [{ translateY: 2 }] }}
                    />
                  </Text>
                </Pill>
              ) : null}

              {summary?.social?.website ? (
                <Pill variant="filled" borderColor={"#5b5b5b" + "cc"} noText>
                  <Text
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                    }}
                  >
                    <Globe
                      size={18}
                      color="#fff"
                      style={{ transform: [{ translateY: 2 }] }}
                    />
                  </Text>
                </Pill>
              ) : null}
            </View>
            <Pill variant="filled" borderColor={"#5b5b5b" + "cc"} noText>
              <Text
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                }}
              >
                <LinkSimple
                  size={18}
                  color="#fff"
                  style={{ transform: [{ translateY: 2 }] }}
                />
              </Text>
            </Pill>
          </BlurView>
        </Rounded>
      </View>
    </View>
  );
};
