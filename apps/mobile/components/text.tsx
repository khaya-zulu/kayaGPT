import { TextProps } from "react-native";
import styled from "styled-components/native";

import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

export const Text = styled.Text`
  font-family: SpaceGrotesk-Medium;
  font-size: 1.5rem;
  line-height: 1.5rem;
  font-size: 16px;
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
