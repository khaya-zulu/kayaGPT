import { BlurView } from "expo-blur";
import { View, Image } from "react-native";

import { Rounded } from "@/components/rounded";
import { zinc300, zinc400, zinc700, zinc800, zinc500 } from "@/constants/theme";
import { Text } from "@/components/text";
import { Circle, House } from "phosphor-react-native";
import { MainAppBox } from "@/features/main-app-box";
import { Pill } from "@/components/pill";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useLocalSearchParams } from "expo-router";
import { useUserOverviewQuery } from "@/queries/users";
import { UserSummary } from "@/features/user-summary";
import { useUserSettings } from "@/hooks/use-user-settings";
import { useState } from "react";
import { DescriptionPreview } from "@/features/description-preview";

const BottomBar = ({ userOverview }: { userOverview: any }) => {
  const userSettings = useUserSettings();

  return (
    <View style={{ position: "absolute", bottom: 20, width: "100%" }}>
      <Rounded
        size={35}
        style={{
          overflow: "hidden",
          borderWidth: 2,
          borderColor: zinc700,
          maxWidth: 600,
          width: "100%",
          marginHorizontal: "auto",
        }}
      >
        <LinearGradient
          colors={[zinc800, zinc700]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: "100%",
            flexDirection: "row",
            gap: 5,
            paddingHorizontal: 20,
            paddingVertical: 10,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <View>
              <Circle weight="fill" color={zinc500} size={12} />
              <Circle
                weight="fill"
                color={zinc400}
                size={12}
                style={{ marginTop: 5 }}
              />
            </View>
            <Rounded
              style={{
                backgroundColor: "#222222",
                overflow: "hidden",
                borderColor: "#5b5b5b" + "cc",
                borderWidth: 1,
              }}
            >
              <BlurView
                intensity={50}
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  paddingVertical: 5,
                  paddingLeft: 10,
                  paddingRight: 20,
                }}
              >
                <Rounded
                  size="2xl"
                  style={{
                    overflow: "hidden",
                  }}
                >
                  <Image
                    style={{ height: 45, width: 45 }}
                    source={{
                      uri: userSettings.avatarUrl,
                    }}
                  />
                </Rounded>
                <Text fontSize="sm" style={{ color: "#fff" }}>
                  {userOverview?.displayName}
                  {"\n"}
                  <Text fontSize="sm" style={{ color: zinc300 }}>
                    Personal Workspace
                  </Text>
                </Text>
              </BlurView>
            </Rounded>
          </View>
          <View>
            <View
              style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
            >
              <Text
                style={{
                  marginHorizontal: 5,
                  color: zinc300,
                }}
              >
                /
              </Text>

              <Link href="/">
                <Pill variant="filled" borderColor={"#5b5b5b" + "cc"} noText>
                  <Text
                    style={{
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                    }}
                  >
                    <House
                      size={20}
                      color="#fff"
                      style={{ transform: [{ translateY: 2 }] }}
                    />
                  </Text>
                </Pill>
              </Link>
            </View>
          </View>
        </LinearGradient>
      </Rounded>
    </View>
  );
};

export default function SpaceIdPage() {
  const { username } = useLocalSearchParams<{ username: string }>();

  const userOverviewQuery = useUserOverviewQuery(username);
  const userOverview = userOverviewQuery.data;

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  return (
    <MainAppBox
      backgroundStyle={{
        opacity: 0.3,
        intensity: 20,
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth: 800,
          paddingVertical: 60,
          marginHorizontal: "auto",
          flex: 1,
        }}
      >
        {isDescriptionExpanded ? (
          <DescriptionPreview
            height="80%"
            description={userOverview?.description}
            onClose={() => setIsDescriptionExpanded(false)}
          />
        ) : null}

        {!isDescriptionExpanded ? (
          <UserSummary
            summary={userOverview}
            onDescriptionPress={() => setIsDescriptionExpanded(true)}
          />
        ) : null}
        <BottomBar userOverview={userOverview} />
      </View>
    </MainAppBox>
  );
}
