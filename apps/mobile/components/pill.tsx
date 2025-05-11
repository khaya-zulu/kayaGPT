import { Rounded } from "./rounded";
import { Text } from "./text";
import { ReactNode } from "react";
import { TextProps, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { zinc100, zinc200, zinc300, zinc400 } from "@/constants/theme";

export const Pill = ({
  children,
  style,
  noText,
  variant = "outline",
}: {
  children: ReactNode;
  style?: TextProps["style"];
  noText?: boolean;
  variant?: "filled" | "outline" | "white";
}) => {
  const colors = {
    filled: ["#222222", "#222222"],
    outline: [zinc200, zinc200],
    white: ["#ffffff" + "80", "#ffffff"],
  };

  const borderColor = {
    filled: "#5b5b5b",
    outline: zinc300,
    white: zinc200,
  };

  return (
    <View style={{ position: "relative" }}>
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
        <BlurView style={{ paddingHorizontal: 10 }} intensity={50}>
          {noText ? (
            children
          ) : (
            <Text
              style={[
                style,
                { color: variant === "filled" ? "#fff" : undefined },
              ]}
            >
              {children}
            </Text>
          )}
        </BlurView>
      </Rounded>
    </View>
  );
};
