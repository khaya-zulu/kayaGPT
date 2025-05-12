import styled from "styled-components/native";
import { View } from "react-native";

import { BoxWithChat } from "@/features/main-app-box";

import { Pill } from "@/components/pill";
import { Link, Slot, usePathname } from "expo-router";

import { ArrowLeft } from "phosphor-react-native";

const Container = styled.Pressable`
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;

export default function ProfileLayout() {
  const pathname = usePathname();

  return (
    <BoxWithChat
      toolbar={
        <View
          style={{
            flexDirection: "row",
            gap: 5,
            padding: 10,
            alignItems: "center",
          }}
        >
          <Link href="/" style={{ marginRight: 10 }}>
            <ArrowLeft size={14} weight="bold" />
          </Link>
          <Link href="/profile">
            <Pill variant={pathname === "/profile" ? "primary" : "white"}>
              Profile
            </Pill>
          </Link>
          <Link href="/profile/workspace">
            <Pill
              variant={pathname.includes("/workspace") ? "primary" : "white"}
            >
              Workspace
            </Pill>
          </Link>
          <Link href="/profile/bio">
            <Pill variant={pathname.includes("/bio") ? "primary" : "white"}>
              Bio
            </Pill>
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
