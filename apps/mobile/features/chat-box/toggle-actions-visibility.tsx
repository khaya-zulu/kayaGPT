import { zinc600, zinc100, roundedFull } from "@/constants/theme";

import { CaretLeft } from "phosphor-react-native";
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

export const ToggleActionsVisibility = () => {
  return (
    <IconBox>
      <CaretLeft size={12} color={zinc600} weight="bold" />
    </IconBox>
  );
};
