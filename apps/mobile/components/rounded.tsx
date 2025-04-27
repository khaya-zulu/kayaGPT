import { rounded2xl, roundedFull, roundedLg } from "@/constants/theme";
import styled from "styled-components/native";

const ROUNDED = {
  "2xl": rounded2xl,
  lg: roundedLg,
  full: roundedFull,
  none: 0,
};

export const Rounded = styled.View<{
  size?: keyof typeof ROUNDED;
}>`
  border-radius: ${({ size = "2xl" }) => ROUNDED[size]};
`;
