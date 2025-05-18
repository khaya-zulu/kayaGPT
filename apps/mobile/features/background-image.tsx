import { ImageBackground, View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { zinc50 } from "@/constants/theme";

export const BackgroundImageFeature = ({
  opacity,
  intensity,
  color = zinc50,
}: {
  opacity?: number;
  intensity?: number;
  color?: string;
}) => {
  return (
    <>
      <BlurView
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          left: 0,
        }}
        intensity={intensity ?? 20}
      />
      <View
        style={{
          backgroundColor: color + "d9",
          height: "100%",
          width: "100%",
          position: "absolute",
          left: 0,
          opacity,
        }}
      />
      <ImageBackground
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          left: 0,
          opacity: 0.55,
        }}
        source={{
          uri: "https://www.transparenttextures.com/patterns/worn-dots.png",
        }}
        resizeMode="repeat"
      />
      <LinearGradient
        colors={[color + "80", "#ffffff" + "00"]}
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          left: 0,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
    </>
  );
};
