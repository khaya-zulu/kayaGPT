import {
  rounded2xl,
  roundedFull,
  roundedLg,
  roundedMd,
} from "@/constants/theme";
import styled from "styled-components/native";

const ROUNDED = {
  "2xl": rounded2xl,
  lg: roundedLg,
  md: roundedMd,
  full: roundedFull,
  none: 0,
};

export type RoundedSize = keyof typeof ROUNDED | number;

export const Rounded = styled.View<{
  size?: RoundedSize;
}>`
  border-radius: ${({ size = "2xl" }) =>
    typeof size === "number" ? `${size}px` : ROUNDED[size]};
`;
