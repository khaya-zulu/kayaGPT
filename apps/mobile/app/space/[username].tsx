import { BlurView } from "expo-blur";
import { View, Image } from "react-native";

import { styled } from "styled-components/native";

import { isWeb } from "@/constants/platform";

import { Rounded } from "@/components/rounded";
import {
  roundedMd,
  zinc100,
  zinc300,
  zinc400,
  zinc700,
  zinc800,
  zinc900,
  zinc600,
  zinc500,
} from "@/constants/theme";
import { Text } from "@/components/text";
import {
  Circle,
  GithubLogo,
  House,
  LinkedinLogo,
  SunHorizon,
  XLogo,
} from "phosphor-react-native";
import { MainAppBox } from "@/features/main-app-box";
import { Pill } from "@/components/pill";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useLocalSearchParams } from "expo-router";
import { useUserOverviewQuery } from "@/queries/users";
import { useUserSettings } from "@/hooks/use-user-settings";

const SpaceBox = styled(Rounded)<{ borderColor: string }>`
  border: 1px solid ${(props) => props.borderColor};
  overflow: hidden;
  width: 100%;
  border-top-right-radius: ${roundedMd};
  border-top-left-radius: ${roundedMd};
`;

const MenuBox = styled(View)<{ borderColor?: string }>`
  border: 1px solid ${(props) => props.borderColor};
  border-left-color: transparent;
  border-right-color: transparent;
  padding: 5px 22px;
  flex-direction: row;
  gap: 15px;
  align-items: center;
`;

export default function SpaceIdPage() {
  const { username } = useLocalSearchParams<{ username: string }>();

  const { colorSettings } = useUserSettings();

  const userOverviewQuery = useUserOverviewQuery(username);
  const userOverview = userOverviewQuery.data;

  return (
    <MainAppBox
      backgroundStyle={{
        opacity: 0.4,
        intensity: 20,
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth: 600,
          paddingVertical: 60,
          marginHorizontal: "auto",
          flex: 1,
        }}
      >
        <Rounded
          style={{
            backgroundColor: "#ffffff" + "e6",
            overflow: "hidden",
            borderWidth: 1,
            borderColor: colorSettings[100] + "80",
          }}
        >
          <BlurView>
            <View
              style={{
                flexDirection: "row",
                gap: 5,
                paddingHorizontal: 10,
                paddingVertical: 8,
                justifyContent: "flex-end",
              }}
            >
              <Circle size={18} weight="fill" color="#e7e5e4" />
              <Circle size={18} weight="fill" color="#e7e5e4" />
              <Circle size={18} weight="fill" color={colorSettings.base} />
            </View>

            <MenuBox borderColor={colorSettings[100] + "80"}>
              <SunHorizon size={18} />
              <Text>18:58 PM, 22°C</Text>
            </MenuBox>

            <View style={{ padding: 5 }}>
              <SpaceBox borderColor={colorSettings[100] + "e6"}>
                <View
                  style={{
                    height: "100%",
                    width: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    backgroundColor: colorSettings[50],
                    opacity: isWeb ? 0.5 : 0.2,
                  }}
                />

                <BlurView
                  intensity={20}
                  style={{
                    backgroundColor: colorSettings[50] + "80",
                    padding: 20,
                  }}
                >
                  <Text>{userOverview?.description}</Text>
                </BlurView>
              </SpaceBox>
            </View>
          </BlurView>
        </Rounded>

        <Rounded
          size={35}
          style={{
            position: "absolute",
            bottom: 20,
            width: "100%",
            overflow: "hidden",
            borderWidth: 1,
            borderColor: zinc800,
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
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
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
                        uri: `http://localhost:8787/api/user/profile/${userOverview?.id}`,
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
                <Pill variant="filled" borderColor={"#5b5b5b" + "cc"} noText>
                  <Text
                    style={{
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                    }}
                  >
                    <XLogo
                      size={20}
                      color="#fff"
                      style={{ transform: [{ translateY: 2 }] }}
                    />
                  </Text>
                </Pill>

                <Pill variant="filled" borderColor={"#5b5b5b" + "cc"} noText>
                  <Text
                    style={{
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                    }}
                  >
                    <GithubLogo
                      size={20}
                      color="#fff"
                      style={{ transform: [{ translateY: 2 }] }}
                    />
                  </Text>
                </Pill>

                <Pill variant="filled" borderColor={"#5b5b5b" + "cc"} noText>
                  <Text
                    style={{
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                    }}
                  >
                    <LinkedinLogo
                      size={20}
                      color="#fff"
                      style={{ transform: [{ translateY: 2 }] }}
                    />
                  </Text>
                </Pill>

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
    </MainAppBox>
  );
}
