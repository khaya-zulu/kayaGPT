import { TextInput, View } from "react-native";

import { styled } from "styled-components/native";

import { zinc200, rounded2xl, zinc600 } from "@/constants/theme";

import { ViewActionsFeature } from "./view-actions";
import {
  GithubLogo,
  GlobeSimple,
  LinkedinLogo,
  Microphone,
  XLogo,
} from "phosphor-react-native";
import { ColorPickerFeature } from "./color-picker";

const InputBox = styled.View`
  background-color: #fff;
  border-radius: ${rounded2xl};
  padding: 1.5rem;
  border: 2px solid ${zinc200};
`;

const InputContainer = styled.View`
  max-width: 56rem;
  margin: 0 auto;
  width: 100%;
  flex-direction: row;
  align-items: end;
  gap: 15px;
`;

export const InputBoxFeature = () => {
  return (
    <InputContainer>
      <ColorPickerFeature />
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            paddingBottom: "1rem",
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ViewActionsFeature />

          <View style={{ flexDirection: "row", gap: 15 }}>
            <GlobeSimple size={17} weight="bold" color={zinc600} />
            <GithubLogo size={17} weight="bold" color={zinc600} />
            <LinkedinLogo size={17} weight="bold" color={zinc600} />
            <XLogo size={17} weight="bold" color={zinc600} />
            <Microphone size={19} weight="fill" />
          </View>
        </View>
        <InputBox>
          <TextInput
            multiline
            numberOfLines={6}
            placeholder="Type something..."
          />
        </InputBox>
      </View>
    </InputContainer>
  );
};
