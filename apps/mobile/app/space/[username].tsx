import { BlurView } from "expo-blur";
import { View, Image } from "react-native";

import { styled } from "styled-components/native";

import { isWeb } from "@/constants/platform";

import { Rounded } from "@/components/rounded";
import {
  roundedMd,
  sky100,
  sky200,
  sky50,
  zinc100,
  zinc400,
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

const SpaceBox = styled(Rounded)`
  border: 1px solid ${sky100};
  overflow: hidden;
  width: 100%;
  border-top-right-radius: ${roundedMd};
  border-top-left-radius: ${roundedMd};
`;

const MenuBox = styled(View)`
  border: 1px solid ${zinc100};
  border-left-color: transparent;
  border-right-color: transparent;
  padding: 5px 22px;
  flex-direction: row;
  gap: 15px;
  align-items: center;
`;

export default function SpaceIdPage() {
  const { username } = useLocalSearchParams<{ username: string }>();

  const userOverviewQuery = useUserOverviewQuery(username);
  const userOverview = userOverviewQuery.data;

  return (
    <MainAppBox backgroundStyle={{ opacity: 0.6, intensity: 10 }}>
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
          style={{ backgroundColor: "#ffffff" + "b3", overflow: "hidden" }}
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
              <Circle size={18} weight="fill" color="#a7f3d0" />
            </View>

            <MenuBox>
              <SunHorizon size={18} />
              <Text>18:58 PM, 22°C</Text>
            </MenuBox>

            <View style={{ padding: 5 }}>
              <SpaceBox>
                <View
                  style={{
                    height: "100%",
                    width: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    backgroundColor: sky50,
                    opacity: isWeb ? 0.5 : 0.2,
                  }}
                />

                <BlurView
                  intensity={20}
                  style={{
                    backgroundColor: sky50 + "80",
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
          size={28}
          style={{
            position: "absolute",
            bottom: 20,
            width: "100%",
            overflow: "hidden",
          }}
        >
          <LinearGradient
            colors={["#ffffff" + "00", sky200]}
            style={{ padding: 1 }}
          >
            <Rounded
              size={28}
              style={{
                backgroundColor: "#fff",
                overflow: "hidden",
                width: "100%",
                flexDirection: "row",
                gap: 5,
                paddingHorizontal: 20,
                paddingVertical: 15,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{ flexDirection: "row", gap: 15, alignItems: "center" }}
              >
                <Rounded
                  size="2xl"
                  style={{
                    overflow: "hidden",
                    transform: [{ rotate: "3deg" }],
                  }}
                >
                  <Image
                    style={{ height: 50, width: 50 }}
                    source={{
                      uri: `http://localhost:8787/api/user/profile/${userOverview?.id}`,
                    }}
                  />
                </Rounded>
                <Text>
                  {userOverview?.displayName}
                  {"\n"}
                  <Text>Personal Workspace</Text>
                </Text>
              </View>
              <View>
                <View
                  style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
                >
                  <Pill variant="filled" noText>
                    <Text
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                      }}
                    >
                      <XLogo
                        size={18}
                        color="#fff"
                        style={{ transform: [{ translateY: 2 }] }}
                      />
                    </Text>
                  </Pill>

                  <Pill variant="filled" noText>
                    <Text
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                      }}
                    >
                      <GithubLogo
                        size={18}
                        color="#fff"
                        style={{ transform: [{ translateY: 2 }] }}
                      />
                    </Text>
                  </Pill>

                  <Pill variant="filled" noText>
                    <Text
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                      }}
                    >
                      <LinkedinLogo
                        size={18}
                        color="#fff"
                        style={{ transform: [{ translateY: 2 }] }}
                      />
                    </Text>
                  </Pill>

                  <Text
                    style={{
                      fontWeight: "bold",
                      marginHorizontal: 5,
                      color: zinc400,
                    }}
                  >
                    /
                  </Text>

                  <Link href="/">
                    <Pill variant="filled" noText>
                      <Text
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                        }}
                      >
                        <House
                          size={18}
                          color="#fff"
                          style={{ transform: [{ translateY: 2 }] }}
                        />
                      </Text>
                    </Pill>
                  </Link>
                </View>
              </View>
            </Rounded>
          </LinearGradient>
        </Rounded>
      </View>
    </MainAppBox>
  );
}
