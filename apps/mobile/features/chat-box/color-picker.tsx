import { View } from "react-native";

import { roundedFull } from "@/constants/theme";
import { Circle } from "phosphor-react-native";
import { useUserSettings } from "@/hooks/use-user-settings";

// todo: use the scroll progress to show a scroll indicator.
export const ColorPicker = () => {
  const { colorSettings } = useUserSettings();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {[colorSettings["300"], colorSettings["400"], colorSettings.base].map(
        (color, index) => (
          <Circle
            key={index}
            style={{
              borderRadius: roundedFull,
              marginLeft: -5 * index,
            }}
            weight="fill"
            size={18}
            color={color}
          />
        )
      )}
    </View>
  );
};
