import Animated from "react-native-reanimated";

import styled from "styled-components/native";

import { textSm, fontSpaceGrotesk } from "@/constants/theme";

const FONT_SIZE = {
  sm: textSm,
  base: 16,
  lg: 20,
  "2xl": 24,
} as const;

export const Text = styled.Text<{ fontSize?: keyof typeof FONT_SIZE }>`
  font-family: ${fontSpaceGrotesk};
  font-size: 24px;
  line-height: 24px;
  font-size: ${(props) => FONT_SIZE[props.fontSize ?? "base"]}px;
`;

export const AnimatedText = styled(Animated.Text)<{
  fontSize?: keyof typeof FONT_SIZE;
}>`
  font-family: ${fontSpaceGrotesk};
  font-size: 24px;
  line-height: 24px;
  font-size: ${(props) => FONT_SIZE[props.fontSize ?? "base"]}px;
`;
