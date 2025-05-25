import { ReactNode } from "react";

import { View } from "react-native";
import { Message } from "@ai-sdk/react";
import { Cube } from "phosphor-react-native";

import Markdown from "react-native-markdown-display";

import { Text } from "@/components/text";
import { Rounded } from "@/components/rounded";
import { useUserSettings } from "@/hooks/use-user-settings";
import { BlurView } from "expo-blur";
import { DateTime } from "luxon";
import { fontSpaceGrotesk } from "@/constants/theme";

export const ChatMessage = ({
  role,
  children,
  parts,
  actions,
  createdAt,
}: {
  role: "Assistant" | "User";
  children?: ReactNode;
  parts?: Message["parts"];
  content?: string;
  messageId: string;
  actions?: ReactNode;
  hideCube?: boolean;
  createdAt?: Date;
}) => {
  const isAssistant = role === "Assistant";

  const { colorSettings } = useUserSettings();

  const content = parts
    ?.filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");

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
              {role === "Assistant" || !createdAt ? null : (
                <Text>{DateTime.fromJSDate(createdAt).toFormat("t a")}</Text>
              )}
            </View>
            <View style={{ paddingVertical: 20, paddingHorizontal: 25 }}>
              {content ? (
                <Markdown
                  style={{
                    body: { fontFamily: fontSpaceGrotesk, fontSize: 16 },
                  }}
                >
                  {content}
                </Markdown>
              ) : null}
              {children}
            </View>
          </View>
        </BlurView>
      </Rounded>
      {actions}
    </View>
  );
};
