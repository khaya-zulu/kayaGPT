import { zinc100, zinc400, zinc500, zinc600, zinc800 } from "@/constants/theme";
import { useUserSettings } from "@/hooks/use-user-settings";
import { useWatch } from "@/hooks/use-watch";
import { useWorkspaceColorPaletteMutation } from "@/mutations/user";
import { Circle } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";

import { getColors, type ImageColorsResult } from "react-native-image-colors";
import styled from "styled-components/native";

export type WebImageColors = Extract<ImageColorsResult, { platform: "web" }>;

const ColorButton = styled.TouchableOpacity<{ borderColor: string }>`
  border-radius: 100px;
  border-color: ${(props) => props.borderColor};
  border-width: 2px;
  padding: 1px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const ColorPalette = ({
  src,
  onSelected,
  isSavedPalette,
  defaultColor,
}: {
  src: string;
  onSelected?: (color: string) => void;
  isSavedPalette?: boolean;
  defaultColor?: string;
}) => {
  const userSettings = useUserSettings();
  const workspacePalette = useWorkspaceColorPaletteMutation({
    onSuccess: async () => {
      return userSettings.invalidate();
    },
  });

  const [colorPalette, setColorPalette] = useState<
    WebImageColors | undefined
  >();

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    defaultColor
  );

  const handleColorChange = async (color?: string) => {
    if (color && colorPalette) {
      setSelectedColor(color);
      onSelected?.(color);

      if (isSavedPalette) {
        await workspacePalette.mutateAsync({
          color,
        });

        await userSettings.invalidate();
      }
    }
  };

  useEffect(() => {
    const fetchColorPalette = async () => {
      try {
        const colors = await getColors(src, {
          key: src,
          fallback: "#fff",
          cache: true,
        });

        if (colors.platform === "web") {
          setColorPalette(colors);
        } else if (colors.platform === "ios") {
          setColorPalette({
            dominant: colors.detail,
            darkVibrant: colors.primary,
            vibrant: colors.background,
            lightMuted: colors.background,
            lightVibrant: colors.background,
            darkMuted: colors.detail,
            muted: colors.detail,
            platform: "web",
          });
        }
      } catch (err) {
        setColorPalette({
          dominant: zinc400,
          darkVibrant: zinc800,
          vibrant: zinc500,
          lightMuted: zinc100,
          lightVibrant: zinc100,
          darkMuted: zinc400,
          muted: zinc600,
          platform: "web",
        });

        // security error is thrown for http:// images
        // which is only expected in development
        console.error("Error fetching color palette:", err);
      }
    };

    fetchColorPalette();
  }, []);

  const dominant = colorPalette?.dominant;
  const vibrant = colorPalette?.vibrant;
  const darkVibrant = colorPalette?.darkVibrant;
  const darkMuted = colorPalette?.darkMuted;

  useWatch(defaultColor, (prev, curr) => {
    if (prev !== undefined) {
      setSelectedColor(curr);
    }
  });

  return (
    <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
      <ColorButton
        borderColor={
          dominant && selectedColor === dominant
            ? dominant + "70"
            : "transparent"
        }
        onPress={() => handleColorChange(dominant)}
      >
        <Circle color={dominant} weight="fill" size={16} />
      </ColorButton>

      <ColorButton
        borderColor={
          darkMuted && selectedColor === darkMuted
            ? darkMuted + "70"
            : "transparent"
        }
        onPress={() => handleColorChange(darkMuted)}
      >
        <Circle color={darkMuted} weight="fill" size={16} />
      </ColorButton>

      <ColorButton
        borderColor={
          darkVibrant && selectedColor === darkVibrant
            ? darkVibrant + "70"
            : "transparent"
        }
        onPress={() => handleColorChange(darkVibrant)}
      >
        <Circle color={darkVibrant} weight="fill" size={16} />
      </ColorButton>

      <ColorButton
        borderColor={
          vibrant && selectedColor === vibrant ? vibrant + "70" : "transparent"
        }
        onPress={() => handleColorChange(vibrant)}
      >
        <Circle color={vibrant} weight="fill" size={16} />
      </ColorButton>
    </View>
  );
};
