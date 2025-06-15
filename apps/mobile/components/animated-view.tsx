import Animated, { AnimatedProps } from "react-native-reanimated";

import { ViewProps, View } from "react-native";

export const AnimatedView = ({
  isAnimationDisabled,
  ...props
}: AnimatedProps<ViewProps> & { isAnimationDisabled?: boolean }) => {
  const Component = isAnimationDisabled ? View : Animated.View;

  return <Component {...(props as any)} />;
};
