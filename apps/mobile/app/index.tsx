import { styled } from "styled-components/native";

import { ImageBackground, View } from "react-native";
import { BlurView } from "expo-blur";

import { Text } from "@/components/text";

import { InputBoxFeature } from "@/features/index";

import { sky800, zinc200, rounded2xl } from "@/constants/theme";

const Container = styled.View`
  max-width: 32rem;
  margin: 0 auto;
  width: 100%;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
`;

// background-color: #25008a;
// background-image: url("https://www.transparenttextures.com/patterns/worn-dots.png");

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
          <Text>
            Hi My name is Khaya, Design/Product Engineer and, my strengths are
            in frontend development. However I am a huge fan of design and I am
            pr
          </Text>
          <Text style={{ color: sky800 }}>
            Hi My name is Khaya, Design/Product Engineer and, my strengths are
            in frontend development. However I am a huge fan of design and I am
            pr
          </Text>
        </Container>

        <InputBoxFeature />
      </View>
    </ImageBackground>
  );
}
