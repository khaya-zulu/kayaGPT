import { Rounded, RoundedSize } from "./rounded";
import { Text } from "./text";
import { ReactNode } from "react";
import { TextProps, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { zinc100, zinc200, zinc300 } from "@/constants/theme";
import { useUserSettings } from "@/hooks/use-user-settings";

export const Button = ({
  children,
  style,
  variant = "outline",
  onPress,
  borderColor,
  rounded = "lg",
  padding = { horizontal: 10, vertical: 0 },
}: {
  children: ReactNode;
  style?: TextProps["style"];
  variant?: "filled" | "outline" | "white" | "primary";
  onPress?: () => void;
  borderColor?: string;
  rounded?: RoundedSize;
  padding?: { horizontal?: number; vertical?: number };
}) => {
  const { colorSettings } = useUserSettings();

  const colors = {
    filled: ["#222222", "#222222"],
    outline: [zinc200, zinc200],
    white: [zinc200 + "CC", zinc100],
    primary: [colorSettings[200], colorSettings[200]],
  };

  const variantBorderColor = {
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
    filled: "#ffffff00",
    outline: "#fff",
    white: "#fff",
    primary: colorSettings[50],
  };

  return (
    <TouchableOpacity style={{ position: "relative" }} onPress={onPress}>
      <Rounded
        size={rounded}
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
        size={rounded}
        style={{
          borderWidth: 1,
          borderColor: borderColor ?? variantBorderColor[variant],
          overflow: "hidden",
          position: "relative",
        }}
      >
        <BlurView intensity={50}>
          <Text
            fontSize="sm"
            style={[
              {
                color: text[variant],
                paddingHorizontal: padding.horizontal,
                paddingVertical: padding.vertical,
                backgroundColor: backgroundColor[variant],
              },
              style,
            ]}
          >
            {children}
          </Text>
        </BlurView>
      </Rounded>
    </TouchableOpacity>
  );
};
