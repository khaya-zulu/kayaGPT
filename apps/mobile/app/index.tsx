import { styled } from "styled-components/native";

import { ImageBackground, View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { GradientText, Text } from "@/components/text";

import { InputBoxFeature } from "@/features/index";

import { sky800, sky500 } from "@/constants/theme";
import { Square } from "phosphor-react-native";

const Container = styled.View`
  max-width: 32rem;
  margin: 0 auto;
  width: 100%;
  flex-direction: column;
  gap: 2rem;
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
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Square style={{ opacity: 0 }} />
            <Text>
              Hi My name is Khaya, Design/Product Engineer and, my strengths are
              in frontend development. However I am a huge fan of design and I
              am pr
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 20 }}>
            <Square color={sky500} weight="fill" />
            <Text style={{ color: sky800 }}>
              Hi My name is Khaya, Design/Product Engineer and, my strengths are
              in frontend development. However I am a huge fan of design and I
              am pr
            </Text>
          </View>
        </Container>

        <InputBoxFeature />
      </View>
    </ImageBackground>
  );
}
