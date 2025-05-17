import { Rounded } from "@/components/rounded";
import { useWorkspaceColorPaletteMutation } from "@/mutations/user";
import { Circle } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";

import { getColors, type ImageColorsResult } from "react-native-image-colors";
import styled from "styled-components/native";

export type WebImageColors = Extract<ImageColorsResult, { platform: "web" }>;

const ColorButton = styled.TouchableOpacity<{ borderColor: string }>`
  border-radius: 100px;
  padding: 0.5px;
  border-color: ${(props) => props.borderColor};
  border-width: 2px;
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
  const workspacePalette = useWorkspaceColorPaletteMutation();

  const [colorPalette, setColorPalette] = useState<
    WebImageColors | undefined
  >();

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    defaultColor
  );

  const handleColorChange = (color?: string) => {
    if (color && colorPalette) {
      setSelectedColor(color);
      onSelected?.(color);

      if (isSavedPalette) {
        workspacePalette.mutate({
          color,
        });
      }
    }
  };

  useEffect(() => {
    const fetchColorPalette = async () => {
      const colors = await getColors(src, { key: src });

      if (colors.platform === "web") {
        setColorPalette(colors);
      }
    };

    fetchColorPalette();
  }, []);

  const dominant = colorPalette?.dominant;
  const vibrant = colorPalette?.vibrant;
  const darkVibrant = colorPalette?.darkVibrant;
  const darkMuted = colorPalette?.darkMuted;

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
        <Circle color={dominant} weight="fill" size={17} />
      </ColorButton>

      <ColorButton
        borderColor={
          darkMuted && selectedColor === darkMuted
            ? darkMuted + "70"
            : "transparent"
        }
        onPress={() => handleColorChange(darkMuted)}
      >
        <Circle color={darkMuted} weight="fill" size={17} />
      </ColorButton>

      <ColorButton
        borderColor={
          darkVibrant && selectedColor === darkVibrant
            ? darkVibrant + "70"
            : "transparent"
        }
        onPress={() => handleColorChange(darkVibrant)}
      >
        <Circle color={darkVibrant} weight="fill" size={17} />
      </ColorButton>

      <ColorButton
        borderColor={
          vibrant && selectedColor === vibrant ? vibrant + "70" : "transparent"
        }
        onPress={() => handleColorChange(vibrant)}
      >
        <Circle color={vibrant} weight="fill" size={17} />
      </ColorButton>
    </View>
  );
};
