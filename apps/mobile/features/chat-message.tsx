import { ReactNode } from "react";

import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Message } from "@ai-sdk/react";
import { Cube } from "phosphor-react-native";

import { Text, AnimatedText } from "@/components/text";
import { Rounded } from "@/components/rounded";
import { useUserSettings } from "@/hooks/use-user-settings";
import { BlurView } from "expo-blur";
import { FadeIn } from "react-native-reanimated";

export const ChatMessage = ({
  role,
  children,
  parts,
  messageId,
  actions,
}: {
  role: "Assistant" | "User";
  children?: ReactNode;
  parts?: Message["parts"];
  content?: string;
  messageId: string;
  actions?: ReactNode;
  hideCube?: boolean;
}) => {
  const isAssistant = role === "Assistant";

  const { colorSettings } = useUserSettings();

  return (
    <View style={{ flexDirection: "column", gap: 15 }}>
      <Rounded
        style={{
          overflow: "hidden",
          borderWidth: 1,
          borderColor: colorSettings[100] + "80",
        }}
      >
        <BlurView>
          <View
            style={{
              backgroundColor: colorSettings[100] + (isAssistant ? "" : "b3"),
            }}
          >
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderBottomWidth: 1,
                borderBottomColor:
                  colorSettings[isAssistant ? 300 : 100] + "80",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              >
                {isAssistant ? (
                  <Cube
                    size={18}
                    color={colorSettings["base"]}
                    weight="duotone"
                    // flip x, todo: use for loading
                    // style={{
                    //   transform: [{ rotateY: "180deg" }],
                    // }}
                  />
                ) : null}
                <Text>{role === "Assistant" ? "AI" : "User"}</Text>
              </View>
              {role === "Assistant" ? null : <Text>20:00 PM</Text>}
            </View>
            <View style={{ paddingVertical: 20, paddingHorizontal: 25 }}>
              <Text>
                {parts?.map((p, idx) => {
                  switch (p.type) {
                    case "text":
                      return (
                        <AnimatedText
                          entering={FadeIn.delay(300 * idx)}
                          key={messageId + idx}
                        >
                          {p.text}
                        </AnimatedText>
                      );
                  }
                })}
              </Text>
              {children}
            </View>
          </View>
        </BlurView>
      </Rounded>
      {actions}
    </View>
  );
};
