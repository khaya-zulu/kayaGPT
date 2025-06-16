import { ViewProps } from "react-native";
import {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { AnimatedView } from "@/components/animated-view";
import { useEffect } from "react";

import { AnimatedViewProps } from "./animated-view";

/**
 * context: the entering animation has very
 * weird behaviors on the browser. Flickering.
 * This component provides a fade-in effect
 * with an upward translation.
 */
export const FadeInView = ({
  onAnimationProgress,
  delay = 0,
  ...props
}: AnimatedViewProps & {
  onAnimationProgress?: (progress: number) => void;
  delay?: number;
}) => {
  const opacity = useSharedValue(0);
  const y = useSharedValue(10);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: y.value }],
      opacity: opacity.value,
    };
  });

  useAnimatedReaction(
    () => {
      return opacity.value;
    },
    () => {
      if (!onAnimationProgress) return;
      runOnJS(onAnimationProgress)?.(opacity.value);
    }
  );

  useEffect(() => {
    y.value = withDelay(
      delay,
      withTiming(0, { duration: 250, easing: Easing.elastic(0.5) })
    );
    opacity.value = withDelay(delay, withTiming(1, { duration: 250 }));
  }, []);

  return <AnimatedView style={animatedStyle} {...props} />;
};
