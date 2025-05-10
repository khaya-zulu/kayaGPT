import {
  Pressable,
  PressableProps,
  SafeAreaView,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

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
  ArrowLeft,
  ArrowUp,
  ClockCounterClockwise,
  GithubLogo,
  GlobeSimple,
  LinkedinLogo,
  LinkSimple,
  Microphone,
  PlusCircle,
  XLogo,
} from "phosphor-react-native";
import { ColorPickerFeature } from "./color-picker";
import { Text } from "@/components/text";
import { LinearGradient } from "expo-linear-gradient";
import { isWeb } from "@/constants/platform";
import { ReactNode, useRef } from "react";
import { MessageTags } from "../message-tags";
import { useLocalSearchParams, useRouter } from "expo-router";

const InputBox = styled.View`
  background-color: #fff;
  border-radius: ${rounded2xl};
  border-bottom-right-radius: ${isWeb ? rounded2xl : 0};
  border-bottom-left-radius: ${isWeb ? rounded2xl : 0};
`;

const InputContainer = styled.View`
  max-width: 896px;
  margin: 0 auto;
  width: 100%;
  flex-direction: row;
  align-items: end;
  gap: 15px;
  padding: ${isWeb ? 0 : 2}px;
  padding-bottom: 0;
`;

const RoundedBox = styled.View`
  border-radius: ${rounded2xl};
  overflow: hidden;
  border-bottom-right-radius: ${isWeb ? rounded2xl : 0};
  border-bottom-left-radius: ${isWeb ? rounded2xl : 0};
`;

const InputLinearBox = ({ children }: { children: ReactNode }) => {
  const colors: any = ["#ffffff" + "00", sky200];

  return (
    <RoundedBox style={{ overflow: "hidden" }}>
      <LinearGradient
        colors={isWeb ? colors : colors.reverse()}
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
      style={{
        flexDirection: isWeb ? "row" : "row-reverse",
        gap: 15,
        marginRight: isWeb ? 0 : "auto",
      }}
    >
      <LinkSimple size={17} weight="bold" color={zinc600} />
      <ClockCounterClockwise size={17} weight="bold" color={zinc600} />
      <PlusCircle size={17} weight="bold" color={zinc600} />
      <Microphone size={19} weight="fill" />
    </View>
  );
};

const BackToolbar = () => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        router.navigate("/");
      }}
      style={{ flexDirection: "row", gap: 15, alignItems: "center" }}
    >
      <ArrowLeft weight="bold" size={14} />
      <Text>Hello world</Text>
    </Pressable>
  );
};

export const InputBoxFeature = ({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: TextInputProps["onChange"];
  onSubmit: PressableProps["onPress"];
}) => {
  const { chatId } = useLocalSearchParams();

  const arrowUpButtonRef = useRef<View>(null);

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
            {chatId ? <BackToolbar /> : null}
            {!chatId ? <MessageTags /> : null}

            <View
              style={{ flexDirection: "row", gap: 15, alignItems: "center" }}
            >
              <ViewActionsFeature />
              <LinkSimple size={17} weight="bold" color={zinc600} />
              <ClockCounterClockwise size={17} weight="bold" color={zinc600} />
              <Microphone size={19} weight="fill" />
            </View>
          </View>
        ) : null}

        <InputLinearBox>
          <InputBox>
            <SafeAreaView>
              <View style={{ padding: 20 }}>
                <TextInput
                  multiline
                  numberOfLines={3}
                  placeholder="Type something..."
                  placeholderTextColor={zinc600}
                  style={{
                    fontFamily: fontSpaceGrotesk,
                    outline: "none",
                    marginBottom: 20,
                  }}
                  onChange={onChange}
                  onKeyPress={(ev) => {
                    if (isWeb && ev.nativeEvent.key === "Enter") {
                      arrowUpButtonRef.current?.focus();

                      onSubmit?.(undefined as any);
                    }
                  }}
                  value={value}
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
                    ref={arrowUpButtonRef}
                    style={{
                      padding: 6,
                      backgroundColor: sky800,
                      borderRadius: roundedFull,
                    }}
                    onPress={onSubmit}
                  >
                    <ArrowUp size={14} color="#fff" weight="bold" />
                  </ArrowUpButton>
                </View>
              </View>
            </SafeAreaView>
          </InputBox>
        </InputLinearBox>
      </View>
    </InputContainer>
  );
};
