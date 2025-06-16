import Animated, { AnimatedProps } from "react-native-reanimated";

import { ViewProps, View } from "react-native";

export type AnimatedViewProps = AnimatedProps<ViewProps> & {
  isAnimationDisabled?: boolean;
};

export const AnimatedView = ({
  isAnimationDisabled,
  ...props
}: AnimatedViewProps) => {
  const Component = isAnimationDisabled ? View : Animated.View;

  return <Component {...(props as any)} />;
};
