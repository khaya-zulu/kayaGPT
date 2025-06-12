import { ImageBackground } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useUserSettings } from "@/hooks/use-user-settings";
import { usePathname } from "expo-router";
import { useMobile } from "@/hooks/use-mobile";

export const BackgroundImageFeature = ({
  opacity,
  intensity,
}: {
  opacity?: number;
  intensity?: number;
  color?: string;
}) => {
  const { colorSettings } = useUserSettings();
  const { isMobile } = useMobile();

  const url = usePathname();

  const isIndex = url === "/";

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
        tint="dark"
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
      <BlurView
        style={{ height: "100%", width: "100%", position: "absolute", left: 0 }}
        intensity={!isMobile || isIndex ? 0 : undefined}
      >
        <ImageBackground
          style={{
            opacity: 0.55,
            height: "100%",
            width: "100%",
          }}
          source={{
            uri: "https://www.transparenttextures.com/patterns/worn-dots.png",
          }}
          resizeMode="repeat"
        />
      </BlurView>
    </>
  );
};
