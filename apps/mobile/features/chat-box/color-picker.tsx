import { View } from "react-native";

import {
  rose200,
  violet200,
  green200,
  amber200,
  roundedFull,
  sky500,
} from "@/constants/theme";
import { Circle } from "phosphor-react-native";
import styled from "styled-components/native";
import { useUserSettings } from "@/hooks/use-user-settings";

const ColorButton = styled.Pressable<{ isSelected: boolean; color: string }>`
  border-color: ${(props) =>
    props.isSelected ? props.color + "70" : "transparent"};
  border-width: 2px;
  border-radius: ${roundedFull};
  height: 20px;
  width: 20px;
  justify-content: center;
  align-items: center;
`;

export const ColorPicker = () => {
  const selectedColor = sky500;

  const { colorSettings } = useUserSettings();

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        paddingBottom: 10,
      }}
    >
      {[colorSettings["300"], colorSettings["400"], colorSettings.base].map(
        (color, index) => (
          <ColorButton
            color={color}
            isSelected={selectedColor === color}
            key={index}
          >
            <Circle
              key={index}
              style={{
                borderRadius: roundedFull,
              }}
              weight="fill"
              size={18}
              color={color}
            />
          </ColorButton>
        )
      )}
    </View>
  );
};
