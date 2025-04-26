import { View } from "react-native";

import { Text } from "@/components/text";
import { zinc600, zinc100, roundedFull } from "@/constants/theme";

import { Plus } from "phosphor-react-native";

export const ViewActionsFeature = () => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <View
        style={{
          width: 22,
          height: 22,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: zinc100,
          justifyContent: "center",
          borderRadius: roundedFull,
        }}
      >
        <Plus size={14} color={zinc600} weight="bold" />
      </View>
      <Text>view actions</Text>
    </View>
  );
};
