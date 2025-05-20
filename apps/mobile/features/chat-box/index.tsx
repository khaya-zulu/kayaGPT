import {
  Pressable,
  PressableProps,
  SafeAreaView,
  TextInputProps,
  View,
} from "react-native";
import { ReactNode, useRef, useState } from "react";

import { styled } from "styled-components/native";
import {
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
import { LinearGradient } from "expo-linear-gradient";

import {
  zinc200,
  rounded2xl,
  zinc600,
  roundedLg,
  roundedFull,
  zinc800,
  zinc700,
} from "@/constants/theme";
import { ColorPicker } from "@/features/chat-box/color-picker";
import { Text } from "@/components/text";
import { isWeb } from "@/constants/platform";
import { TextInput } from "@/components/text-input";
import { useUserSettings } from "@/hooks/use-user-settings";
import { Rounded } from "@/components/rounded";

const InputContainer = styled.View`
  max-width: 750px;
  margin: 0 auto;
  width: 100%;
  flex-direction: row;
  align-items: end;
  gap: 15px;
  padding: ${isWeb ? 0 : 2}px;
  padding-bottom: 0;
`;

const RoundedBox = styled.View`
  border-radius: 20px;
  border-bottom-right-radius: ${isWeb ? "20px" : 0};
  border-bottom-left-radius: ${isWeb ? "20px" : 0};
`;

const InputLinearBox = ({ children }: { children: ReactNode }) => {
  const userSettings = useUserSettings();

  return (
    <RoundedBox style={{ position: "relative" }}>
      <Rounded
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: zinc800 + "cc",
          transform: [{ translateY: 2 }],
          position: "absolute",
        }}
      />
      <Rounded
        style={{
          borderColor: userSettings.colorSettings[300] + "cc",
          borderWidth: 2,
          backgroundColor: "#fff",
        }}
      >
        {children}
      </Rounded>
    </RoundedBox>
  );
};

const ArrowUpButton = styled(Pressable)<{ backgroundColor: string }>`
  padding: 6px;
  background-color: ${(props) => props.backgroundColor};
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

export const ChatBox = ({
  value,
  onChange,
  onSubmit,
  toolbar,
}: {
  value: string;
  onChange: TextInputProps["onChange"];
  onSubmit: PressableProps["onPress"];
  toolbar?: ReactNode;
}) => {
  const arrowUpButtonRef = useRef<View>(null);

  const [height, setHeight] = useState(20);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  const userSettings = useUserSettings();

  return (
    <InputContainer>
      <View style={{ flex: 1, position: "relative" }}>
        <InputLinearBox>
          <SafeAreaView>
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 10,
                paddingBottom: 5,
                borderBottomWidth: 1,
                borderColor: userSettings.colorSettings[100] + "80",
              }}
            >
              <Text fontSize="sm">12:00 AM Jun 12</Text>
            </View>
            <View style={{ paddingVertical: 15, paddingHorizontal: 20 }}>
              <TextInput
                multiline
                placeholder="Type something..."
                style={{
                  marginBottom: 20,
                  minHeight: 20,
                  height,
                }}
                onChange={(ev) => {
                  onChange?.(ev);
                }}
                onContentSizeChange={(ev) => {
                  setHeight(ev.nativeEvent.contentSize.height);
                }}
                onKeyPress={(ev) => {
                  if (isWeb) {
                    if (ev.nativeEvent.key === "Enter" && !isShiftPressed) {
                      arrowUpButtonRef.current?.focus();
                      onSubmit?.(undefined as any);
                    }

                    if (ev.nativeEvent.key === "Shift") {
                      setIsShiftPressed(true);
                    }
                  }
                }}
                // @ts-ignore
                onKeyUp={(ev) => {
                  if (isWeb && ev.nativeEvent.key === "Shift") {
                    setIsShiftPressed(false);
                  }
                }}
                value={value}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {isWeb ? toolbar : null}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  {!isWeb ? <Options /> : null}
                  {isWeb ? <ColorPicker /> : null}
                  <View>
                    <RoundedText fontSize="sm">GPT‑4.1</RoundedText>
                  </View>

                  <ArrowUpButton
                    ref={arrowUpButtonRef}
                    style={{
                      padding: 6,
                      borderRadius: roundedFull,
                    }}
                    backgroundColor={userSettings.colorSettings[800]}
                    onPress={onSubmit}
                  >
                    <ArrowUp size={14} color="#fff" weight="bold" />
                  </ArrowUpButton>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </InputLinearBox>
      </View>
    </InputContainer>
  );
};
