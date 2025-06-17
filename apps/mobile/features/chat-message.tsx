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
import { useMobile } from "@/hooks/use-mobile";
import { CubeLoader } from "./workspace-loader";
import { AnimatedView } from "@/components/animated-view";
import { FadeInDown } from "react-native-reanimated";

export const ChatMessage = ({
  role,
  children,
  parts,
  actions,
  createdAt,
  title,
}: {
  role: "Assistant" | "User";
  title?: ReactNode;
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
  const { isMobile } = useMobile();

  const textOnlyParts = parts?.filter((p) => p.type === "text");

  return (
    <AnimatedView
      entering={FadeInDown.duration(250)}
      style={{ flexDirection: "column", gap: 15 }}
    >
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
                {isAssistant && textOnlyParts?.length !== undefined ? (
                  <>
                    {textOnlyParts.length > 0 ? (
                      <Cube
                        size={18}
                        color={colorSettings["base"]}
                        weight="duotone"
                      />
                    ) : (
                      <CubeLoader color={colorSettings["base"]} />
                    )}
                  </>
                ) : null}
                <Text>{title ?? (role === "Assistant" ? "AI" : "User")}</Text>
              </View>
              {role === "Assistant" || !createdAt ? null : (
                <Text>{DateTime.now().toFormat("t a")}</Text>
              )}
            </View>
            <View
              style={{
                paddingVertical: isMobile ? 10 : 20,
                paddingHorizontal: isMobile ? 20 : 25,
              }}
            >
              {textOnlyParts && textOnlyParts?.length > 0 ? (
                <Markdown
                  style={{
                    body: { fontFamily: fontSpaceGrotesk, fontSize: 16 },
                  }}
                >
                  {textOnlyParts.map((p) => p.text).join("")}
                </Markdown>
              ) : null}
              {children}
            </View>
          </View>
        </BlurView>
      </Rounded>
      {actions}
    </AnimatedView>
  );
};
