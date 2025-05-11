import styled from "styled-components/native";
import { View } from "react-native";

import { BoxWithChat } from "@/features/main-app-box";

import { Pill } from "@/components/pill";
import { Link, Slot } from "expo-router";

const Container = styled.Pressable`
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;

export default function ProfileLayout() {
  return (
    <BoxWithChat
      toolbar={
        <View style={{ flexDirection: "row", gap: 10, padding: 10 }}>
          <Link href="/profile">
            <Pill variant="white">Profile</Pill>
          </Link>
          <Link href="/profile/workspace">
            <Pill variant="white">Workspace</Pill>
          </Link>
          <Link href="/profile/bio">
            <Pill variant="white">Bio</Pill>
          </Link>
        </View>
      }
    >
      <Container>
        <Slot />
      </Container>
    </BoxWithChat>
  );
}
