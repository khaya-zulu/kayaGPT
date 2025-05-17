import { Circle } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";

import { getColors, type ImageColorsResult } from "react-native-image-colors";

type WebImageColors = Extract<ImageColorsResult, { platform: "web" }>;

export const ColorPalette = ({ src }: { src: string }) => {
  const [colorPalette, setColorPalette] = useState<
    WebImageColors | undefined
  >();

  useEffect(() => {
    const fetchColorPalette = async () => {
      const colors = await getColors(src, { key: src });

      if (colors.platform === "web") {
        setColorPalette(colors);
      }
    };

    fetchColorPalette();
  }, []);

  return (
    <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
      <Circle color={colorPalette?.dominant} weight="fill" size={20} />
      <Circle color={colorPalette?.darkMuted} weight="fill" size={20} />
      <Circle color={colorPalette?.darkVibrant} weight="fill" size={20} />
      <Circle color={colorPalette?.vibrant} weight="fill" size={20} />
    </View>
  );
};
