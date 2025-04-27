import { Pressable, TextInput, View } from "react-native";

import { styled } from "styled-components/native";

import {
  zinc200,
  rounded2xl,
  zinc600,
  roundedLg,
  roundedFull,
  sky800,
  sky200,
  fontSpaceGrotesk,
} from "@/constants/theme";

import { ViewActionsFeature } from "./view-actions";
import {
  ArrowUp,
  ClockCounterClockwise,
  GithubLogo,
  GlobeSimple,
  LinkedinLogo,
  LinkSimple,
  Microphone,
  XLogo,
} from "phosphor-react-native";
import { ColorPickerFeature } from "./color-picker";
import { Text } from "@/components/text";
import { LinearGradient } from "expo-linear-gradient";
import { isWeb } from "@/constants/platform";
import { ReactNode } from "react";

const InputBox = styled.View`
  background-color: #fff;
  border-radius: ${rounded2xl};
  padding: 24px;
`;

const InputContainer = styled.View`
  max-width: 896px;
  margin: 0 auto;
  width: 100%;
  flex-direction: row;
  align-items: end;
  gap: 15px;
  padding: ${isWeb ? 0 : 2}px;
`;

const RoundedBox = styled.View`
  border-radius: ${rounded2xl};
  overflow: hidden;
`;

const InputLinearBox = ({ children }: { children: ReactNode }) => {
  return (
    <RoundedBox>
      <LinearGradient
        colors={["#ffffff" + "00", sky200]}
        style={{ borderRadius: rounded2xl, padding: isWeb ? 1 : 2 }}
      >
        {children}
      </LinearGradient>
    </RoundedBox>
  );
};

const ArrowUpButton = styled(Pressable)`
  padding: 6px;
  background-color: ${sky800};
  border-radius: ${roundedFull};
`;

const RoundedText = styled(Text)`
  border-radius: ${roundedLg};
  padding: 2px 8px;
  border-width: 2px;
  border-color: ${zinc200};
`;

const Options = () => {
  return (
    <View
      style={{ flexDirection: "row", gap: 15, marginRight: isWeb ? 0 : "auto" }}
    >
      <LinkSimple size={17} weight="bold" color={zinc600} />
      <ClockCounterClockwise size={17} weight="bold" color={zinc600} />
      <Microphone size={19} weight="fill" />
    </View>
  );
};

export const InputBoxFeature = () => {
  return (
    <InputContainer>
      {isWeb ? <ColorPickerFeature /> : null}
      <View style={{ flex: 1 }}>
        {isWeb ? (
          <View
            style={{
              flexDirection: "row",
              paddingBottom: 16,
              paddingLeft: 10,
              paddingRight: 10,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ViewActionsFeature />

            <View style={{ flexDirection: "row", gap: 15 }}>
              <LinkSimple size={17} weight="bold" color={zinc600} />
              <ClockCounterClockwise size={17} weight="bold" color={zinc600} />
              <Microphone size={19} weight="fill" />
            </View>
          </View>
        ) : null}

        <InputLinearBox>
          <InputBox>
            <TextInput
              multiline
              numberOfLines={6}
              placeholder="Type something..."
              placeholderTextColor={zinc600}
              style={{
                fontFamily: fontSpaceGrotesk,
                outline: "none",
                marginBottom: 20,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              {isWeb ? (
                <View style={{ flexDirection: "row", gap: 15 }}>
                  <GlobeSimple size={17} weight="bold" color={zinc600} />
                  <GithubLogo size={17} weight="bold" color={zinc600} />
                  <LinkedinLogo size={17} weight="bold" color={zinc600} />
                  <XLogo size={17} weight="bold" color={zinc600} />
                </View>
              ) : null}
              {!isWeb ? <Options /> : null}
              <View>
                <RoundedText fontSize="sm">GPT‑4.1</RoundedText>
              </View>

              <ArrowUpButton
                style={{
                  padding: 6,
                  backgroundColor: sky800,
                  borderRadius: roundedFull,
                }}
              >
                <ArrowUp size={14} color="#fff" />
              </ArrowUpButton>
            </View>
          </InputBox>
        </InputLinearBox>
      </View>
    </InputContainer>
  );
};
