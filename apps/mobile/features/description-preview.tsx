import { useUserSettings } from "@/hooks/use-user-settings";
import { BlurView } from "expo-blur";
import { Circle, SunHorizon } from "phosphor-react-native";
import { View } from "react-native";

import { styled } from "styled-components/native";

import { Rounded } from "@/components/rounded";
import { Text } from "@/components/text";
import { isWeb } from "@/constants/platform";
import { roundedMd } from "@/constants/theme";
import { Markdown } from "@/components/markdown";

const MenuBox = styled(View)<{ borderColor?: string }>`
  border: 1px solid ${(props) => props.borderColor};
  border-left-color: transparent;
  border-right-color: transparent;
  padding: 5px 22px;
  flex-direction: row;
  gap: 15px;
  align-items: center;
`;

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
  height,
}: {
  description?: string | null;
  height?: number;
}) => {
  const userSettings = useUserSettings();

  return (
    <Rounded
      style={{
        backgroundColor: "#ffffff",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: userSettings.colorSettings[100] + "80",
        height: "100%",
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
          <Circle
            size={18}
            weight="fill"
            color={userSettings.colorSettings.base}
          />
        </View>

        <View style={{ padding: 5, flex: 1 }}>
          <DescriptionBox borderColor={userSettings.colorSettings[100] + "e6"}>
            <View
              style={{
                height: "100%",
                width: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: userSettings.colorSettings[50],
                opacity: isWeb ? 0.5 : 0.2,
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
  );
};
