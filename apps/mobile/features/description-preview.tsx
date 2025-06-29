import { useUserSettings } from "@/hooks/use-user-settings";
import { BlurView } from "expo-blur";
import { Circle, SunHorizon } from "phosphor-react-native";
import {
  Pressable,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";

import { styled } from "styled-components/native";

import { Rounded } from "@/components/rounded";
import { roundedMd } from "@/constants/theme";
import { Markdown } from "@/components/markdown";
import { useMobile } from "@/hooks/use-mobile";
import { Fragment } from "react";

const DescriptionBox = styled(Rounded)<{ borderColor: string }>`
  border: 1px solid ${(props) => props.borderColor};
  overflow: hidden;
  width: 100%;
  border-top-right-radius: ${roundedMd};
  border-top-left-radius: ${roundedMd};
  height: 100%;
`;

export const DescriptionPreview = ({
  description,
  height = "100%",
  onClose,
  isExpanded = false,
}: {
  description?: string | null;
  height?: string;
  onClose?: () => void;
  isExpanded?: boolean;
}) => {
  const userSettings = useUserSettings();
  const { isMobile } = useMobile();

  const Parent = isMobile ? View : Fragment;

  return (
    <Parent style={{ padding: isExpanded ? 20 : 0 }}>
      <Rounded
        style={{
          backgroundColor: "#ffffff",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: userSettings.colorSettings[100] + "80",
          height: height as any,
        }}
      >
        <BlurView style={{ height: "100%", flexDirection: "column" }}>
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              paddingHorizontal: 10,
              paddingVertical: 8,
              justifyContent: "flex-end",
              borderWidth: 1,
              borderColor: userSettings.colorSettings[100] + "80",
            }}
          >
            <Circle size={18} weight="fill" color="#e7e5e4" />
            <Circle size={18} weight="fill" color="#e7e5e4" />
            <TouchableOpacity onPress={onClose}>
              <Circle
                size={18}
                weight="fill"
                color={userSettings.colorSettings.base}
              />
            </TouchableOpacity>
          </View>

          <View style={{ padding: 5, flex: 1 }}>
            <DescriptionBox
              borderColor={userSettings.colorSettings[100] + "e6"}
            >
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  backgroundColor: userSettings.colorSettings[50],
                  opacity: isMobile ? 0.2 : 0.5,
                }}
              />

              <BlurView
                intensity={20}
                style={{
                  backgroundColor: userSettings.colorSettings[50] + "80",
                  padding: 20,
                  height: "100%",
                }}
              >
                <Markdown>{description}</Markdown>
              </BlurView>
            </DescriptionBox>
          </View>
        </BlurView>
      </Rounded>
    </Parent>
  );
};
