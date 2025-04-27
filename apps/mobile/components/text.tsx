import { TextProps } from "react-native";
import styled from "styled-components/native";

import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { textSm, fontSpaceGrotesk } from "@/constants/theme";

const FONT_SIZE = {
  sm: textSm,
  base: 16,
} as const;

export const Text = styled.Text<{ fontSize?: keyof typeof FONT_SIZE }>`
  font-family: ${fontSpaceGrotesk};
  font-size: 24px;
  line-height: 24px;
  font-size: ${(props) => FONT_SIZE[props.fontSize ?? "base"]};
`;

type GradientTextProps = TextProps & {
  colors: string[];
};

export const GradientText = ({ colors, ...props }: GradientTextProps) => {
  return (
    <MaskedView maskElement={<Text {...props} />}>
      <LinearGradient
        colors={colors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text {...props} style={[props.style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  );
};
