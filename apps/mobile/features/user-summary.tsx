import { View } from "react-native";
import { DescriptionPreview } from "./description-preview";
import { Rounded } from "@/components/rounded";
import { LinearGradient } from "expo-linear-gradient";
import { useUserSettings } from "@/hooks/use-user-settings";
import { BlurView } from "expo-blur";

import { Text } from "@/components/text";
import { Pill } from "@/components/pill";
import {
  GithubLogo,
  Globe,
  LinkedinLogo,
  LinkSimple,
  Sun,
  Sunglasses,
  X,
  XLogo,
} from "phosphor-react-native";
import { zinc700, zinc800 } from "@/constants/theme";

export const UserSummary = ({ description }: { description: string }) => {
  const userSettings = useUserSettings();

  return (
    <View style={{ gap: 10, flexDirection: "row", height: 450 }}>
      <View style={{ flex: 1.5 }}>
        <DescriptionPreview description={description} />
      </View>
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
            <Text>Johannesburg</Text>
            <Text fontSize="2xl" style={{ marginTop: 10 }}>
              17°C
            </Text>
          </View>

          <Sun size={40} />
        </Rounded>
        <Rounded style={{ flex: 1, overflow: "hidden" }}>
          <LinearGradient
            colors={["#d9835e", userSettings.colorSettings[700]]}
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
              <Text fontSize="lg" style={{ color: "#fff" }}>
                10:00 AM
              </Text>
              <Text style={{ color: "#fff" }}>Jun 19{"\n"}Wednesday</Text>
            </BlurView>
          </LinearGradient>
        </Rounded>
        <Rounded style={{ backgroundColor: "#fff", overflow: "hidden" }}>
          <LinearGradient
            colors={[zinc800, zinc700]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingHorizontal: 25,
              paddingVertical: 15,
              flexDirection: "row",
              gap: 5,
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", gap: 5 }}>
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
          </LinearGradient>
        </Rounded>
      </View>
    </View>
  );
};
