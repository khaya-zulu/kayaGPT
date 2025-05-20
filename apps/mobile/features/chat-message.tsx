import { ReactNode } from "react";

import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Message } from "@ai-sdk/react";
import { Cube } from "phosphor-react-native";

import { Text } from "@/components/text";
import { Rounded } from "@/components/rounded";
import { useUserSettings } from "@/hooks/use-user-settings";
import { BlurView } from "expo-blur";

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
    ? [colorSettings[50], "#fff"]
    : ["#ffffff" + "00", "#ffffff" + "00"];

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
                  />
                ) : null}
                <Text>{role === "Assistant" ? "AI" : "User"}</Text>
              </View>
              {role === "Assistant" ? null : <Text>20:00 PM</Text>}
            </View>
            <View style={{ paddingVertical: 20, paddingHorizontal: 25 }}>
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
            </View>
          </View>
        </BlurView>
      </Rounded>
      {actions}
    </View>
  );

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
            borderColor: isAssistant ? colorSettings[100] + "e6" : undefined,
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
