import { styled } from "styled-components/native";

import { Keyboard, SafeAreaView, View } from "react-native";

import { Text } from "@/components/text";

import { InputBoxFeature } from "@/features/index";

import { sky800, rounded2xl, sky200, zinc100 } from "@/constants/theme";
import { Cube } from "phosphor-react-native";
import {
  ContainerWithChatFeature,
  MainContainerFeature,
} from "@/features/app-container";
import { isWeb } from "@/constants/platform";
import { Rounded } from "@/components/rounded";

// todo: this should only be a button on mobile
const Container = styled.Pressable`
  max-width: 512;
  margin: 0 auto;
  width: 100%;
  flex-direction: column;
  gap: 20;
  flex: 1;
`;

const WorkspaceImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: ${rounded2xl};
  margin-left: 20px;
  transform: rotate(-8deg) translateY(-10px);
  z-index: 20;
  /* todo: make this transparent with some kind of mask */
  border-color: #fff;
  border-width: 4px;
`;

const AvatarImage = styled.Image`
  width: 75px;
  height: 75px;
  border-radius: ${rounded2xl};
  margin-left: 20px;
  transform: translateX(-50px) translateY(10px) rotate(4deg);
`;

export default function IndexPage() {
  return (
    <ContainerWithChatFeature>
      <Container
        style={{ padding: isWeb ? 0 : 20 }}
        onPress={() => Keyboard.dismiss()}
      >
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <WorkspaceImage source={require("../assets/images/workspace.png")} />
          <AvatarImage
            source={{
              uri: "https://pbs.twimg.com/profile_images/1830330700920201220/tQz0-0Xq_400x400.jpg",
            }}
          />
        </View>
        <View style={{ flexDirection: "column", gap: 20 }}>
          <Text style={{ flex: 1 }}>Hi my name is Khaya 👋</Text>

          <Rounded
            style={{
              backgroundColor: zinc100 + "80",
              padding: 2,
            }}
          >
            <Rounded style={{ backgroundColor: "#fff", padding: 20 }}>
              <Text>Hello world</Text>
            </Rounded>
          </Rounded>
        </View>
      </Container>
    </ContainerWithChatFeature>
  );
}
