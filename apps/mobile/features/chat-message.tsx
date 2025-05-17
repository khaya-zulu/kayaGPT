import { ReactNode } from "react";

import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Message } from "@ai-sdk/react";
import { Cube } from "phosphor-react-native";

import { Text } from "@/components/text";
import { Rounded } from "@/components/rounded";
import { useUserSettings } from "@/hooks/use-user-settings";

export const ChatMessage = ({
  role,
  children,
  parts,
  messageId,
  content,
  actions,
  hideCube,
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

  const textColor = isAssistant ? colorSettings[800] : undefined;

  const colors = isAssistant
    ? [colorSettings[100] + "B3", colorSettings[100] + "80"]
    : ["#ffffff" + "00", "#ffffff" + "00"];

  return (
    <View
      style={[
        {
          flexDirection: "row",
          gap: 15,
        },
      ]}
    >
      {!hideCube ? (
        <Cube
          color={textColor}
          weight="duotone"
          size={20}
          style={{
            transform: [{ translateY: 2.5 }],
            opacity: role === "Assistant" ? 1 : 0,
          }}
          // flip x, todo: use for loading
          // style={{
          //   transform: [{ rotateY: "180deg" }],
          // }}
        />
      ) : null}
      <View style={{ flex: 1, flexDirection: "column", gap: 10 }}>
        <Rounded
          style={{
            overflow: isAssistant ? "hidden" : undefined,
            borderWidth: isAssistant ? 1 : 0,
            borderColor: isAssistant ? colorSettings[200] : undefined,
            width: "100%",
          }}
        >
          <LinearGradient
            colors={colors as any}
            style={{
              padding: isAssistant ? 20 : 0,
            }}
          >
            <Text>
              {content ??
                parts?.map((p) => {
                  if (p.type === "text") {
                    return <Text key={messageId + p.text}>{p.text}</Text>;
                  }

                  return null;
                })}
            </Text>
            {children}
          </LinearGradient>
        </Rounded>
        {actions}
      </View>
    </View>
  );
};
