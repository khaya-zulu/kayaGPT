import { ImageBackground } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

export const BackgroundImageFeature = () => {
  return (
    <>
      <BlurView
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          left: 0,
        }}
        intensity={20}
      />
      <ImageBackground
        style={{
          backgroundColor: "#ffffff" + "d9",
          height: "100%",
          width: "100%",
          position: "absolute",
          left: 0,
        }}
        source={{
          uri: "https://www.transparenttextures.com/patterns/worn-dots.png",
        }}
        resizeMode="repeat"
      />
      <LinearGradient
        colors={["#e0f2fe" + "80", "#ffffff" + "00"]}
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
