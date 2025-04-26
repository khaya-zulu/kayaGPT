import { styled } from "styled-components/native";

import { Image, ImageBackground, View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { Text } from "@/components/text";

import { InputBoxFeature } from "@/features/index";

import { sky800, roundedLg, rounded2xl } from "@/constants/theme";
import { Cube } from "phosphor-react-native";
import { transform } from "@babel/core";

const Container = styled.View`
  max-width: 32rem;
  margin: 0 auto;
  width: 100%;
  flex-direction: column;
  gap: 20;
  flex: 1;
`;

const BackgroundImage = () => {
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

export default function IndexPage() {
  return (
    <ImageBackground
      style={{
        flex: 1,
        backgroundColor: "#fff",
        width: "100%",
      }}
      source={require("../assets/images/workspace.png")}
      resizeMode="cover"
    >
      <BackgroundImage />
      <View
        style={{
          flex: 1,
          padding: 40,
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Container>
          <View style={{ flexDirection: "row" }}>
            <Image
              style={{
                width: 60,
                height: 60,
                borderRadius: rounded2xl,
                marginLeft: 20,
                transform: [{ rotate: "-5deg" }, { translateY: -10 }],
                zIndex: 20,
                // todo: make this transparent with some kind of mask
                borderColor: "#fff",
                borderWidth: 4,
              }}
              source={require("../assets/images/workspace.png")}
            />
            <Image
              style={{
                width: 80,
                height: 80,
                borderRadius: rounded2xl,
                marginLeft: 20,
                transform: [
                  { translateX: -50 },
                  { translateY: 10 },
                  { rotate: "2deg" },
                ],
              }}
              source={{
                uri: "https://pbs.twimg.com/profile_images/1830330700920201220/tQz0-0Xq_400x400.jpg",
              }}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 20, marginTop: 20 }}>
            <View style={{ opacity: 0 }}>
              <Cube color={sky800} weight="duotone" size={20} />
            </View>
            <Text>
              Hi my name is Khaya, Design/Product Engineer and, my strengths are
              in frontend development. However I am a huge fan of design and I
              am pr
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 20 }}>
            <View>
              <Cube
                color={sky800}
                weight="duotone"
                size={20}
                // flip x, todo: use for loading
                // style={{
                //   transform: [{ rotateY: "180deg" }],
                // }}
              />
            </View>
            <Text style={{ color: sky800 }}>How can I help you today?</Text>
          </View>
        </Container>

        <InputBoxFeature />
      </View>
    </ImageBackground>
  );
}
