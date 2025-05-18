import { ImageBackground } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useUserSettings } from "@/hooks/use-user-settings";

export const BackgroundImageFeature = ({
  opacity,
  intensity,
}: {
  opacity?: number;
  intensity?: number;
  color?: string;
}) => {
  const { colorSettings } = useUserSettings();

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
      <LinearGradient
        colors={[colorSettings[50], colorSettings[50], colorSettings[50]]}
        style={{
          // backgroundColor: color + "d9",
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
    </>
  );
};
