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
  sky800,
  sky200,
} from "@/constants/theme";
import { ColorPicker } from "@/features/chat-box/color-picker";
import { Text } from "@/components/text";
import { isWeb } from "@/constants/platform";
import { ChatBoxToolbar } from "./toolbar";
import { TextInput } from "@/components/text-input";
import { useUserSettings } from "@/hooks/use-user-settings";

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
  const { colorSettings } = useUserSettings();
  const colors: any = ["#ffffff" + "00", colorSettings[300]];

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

  const { colorSettings } = useUserSettings();

  return (
    <InputContainer>
      {isWeb ? <ColorPicker /> : null}
      <View style={{ flex: 1, position: "relative" }}>
        {isWeb ? toolbar : null}

        <InputLinearBox>
          <InputBox>
            <SafeAreaView>
              <View style={{ padding: 20 }}>
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
                    gap: 10,
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  {!isWeb ? <Options /> : null}
                  <View>
                    <RoundedText fontSize="sm">GPT‑4.1</RoundedText>
                  </View>

                  <ArrowUpButton
                    ref={arrowUpButtonRef}
                    style={{
                      padding: 6,
                      borderRadius: roundedFull,
                    }}
                    backgroundColor={colorSettings[800]}
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
