import { View } from "react-native";

import { Text } from "@/components/text";
import { zinc600, zinc100, roundedFull } from "@/constants/theme";

import { Plus } from "phosphor-react-native";
import styled from "styled-components/native";

const IconBox = styled.View`
  width: 25px;
  height: 25px;
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  justify-content: center;
  border-radius: ${roundedFull};
  border: 2px solid ${zinc100};
`;

export const ViewActionsFeature = () => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <IconBox>
        <Plus size={12} color={zinc600} weight="bold" />
      </IconBox>
      <Text>view options</Text>
    </View>
  );
};
