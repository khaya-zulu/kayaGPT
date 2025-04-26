import { styled } from "styled-components/native";

import { View } from "react-native";
import { Text } from "@/components/text";

import { sky800, zinc200, rounded2xl } from "@/constants/theme";

const Container = styled.View`
  max-width: 32rem;
  margin: 0 auto;
  width: 100%;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
`;

const Input = styled.View`
  background-color: #fff;
  border-radius: ${rounded2xl};
  padding: 1rem;
  border: 2px solid ${zinc200};
  height: 10rem;
`;

const InputBox = styled.View`
  background-color: #fff;
  max-width: 56rem;
  margin: 0 auto;
  width: 100%;
`;

export default function IndexPage() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: "2.5rem" }}>
      <Container>
        <Text>
          Hi My name is Khaya, Design/Product Engineer and, my strengths are in
          frontend development. However I am a huge fan of design and I am pr
        </Text>
        <Text style={{ color: sky800 }}>
          Hi My name is Khaya, Design/Product Engineer and, my strengths are in
          frontend development. However I am a huge fan of design and I am pr
        </Text>
      </Container>

      <InputBox>
        <Input />
      </InputBox>
    </View>
  );
}
