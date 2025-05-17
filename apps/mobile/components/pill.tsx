import { Rounded } from "./rounded";
import { Text } from "./text";
import { ReactNode } from "react";
import { Pressable, TextProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import {
  sky200,
  sky50,
  sky800,
  zinc100,
  zinc200,
  zinc300,
} from "@/constants/theme";
import { useUserSettings } from "@/hooks/use-user-settings";

export const Pill = ({
  children,
  style,
  noText,
  variant = "outline",
  onPress,
}: {
  children: ReactNode;
  style?: TextProps["style"];
  noText?: boolean;
  variant?: "filled" | "outline" | "white" | "primary";
  onPress?: () => void;
}) => {
  const { colorSettings } = useUserSettings();

  const colors = {
    filled: ["#222222", "#222222"],
    outline: [zinc200, zinc200],
    white: [zinc200 + "CC", zinc100],
    primary: [colorSettings[200], colorSettings[200]],
  };

  const borderColor = {
    filled: "#5b5b5b",
    outline: zinc300,
    white: zinc200,
    primary: colorSettings[200],
  };

  const text = {
    filled: "#fff",
    outline: undefined,
    white: undefined,
    primary: colorSettings[800],
  };

  const backgroundColor = {
    filled: "#fff",
    outline: "#fff",
    white: "#fff",
    primary: colorSettings[50],
  };

  return (
    <Pressable style={{ position: "relative" }} onPress={onPress}>
      <Rounded
        size="lg"
        style={{
          position: "absolute",
          top: 2,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <LinearGradient
          colors={colors[variant] as any}
          locations={[0.5, 0.8]}
          start={{ x: 0, y: 0.75 }}
          end={{ x: 1, y: 0.25 }}
          style={{ width: "100%", height: "100%" }}
        />
      </Rounded>
      <Rounded
        size="lg"
        style={{
          borderWidth: 1,
          borderColor: borderColor[variant],
          overflow: "hidden",
          position: "relative",
        }}
      >
        <BlurView intensity={50}>
          {noText ? (
            children
          ) : (
            <Text
              style={[
                style,
                {
                  color: text[variant],
                  paddingHorizontal: 10,
                  backgroundColor: backgroundColor[variant],
                },
              ]}
            >
              {children}
            </Text>
          )}
        </BlurView>
      </Rounded>
    </Pressable>
  );
};
