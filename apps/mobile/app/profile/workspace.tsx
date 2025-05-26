import { View, Image, ScrollView } from "react-native";
import { Circle, CursorClick, Desk } from "phosphor-react-native";

import * as Crypto from "expo-crypto";

import { type UseChatHelpers } from "@ai-sdk/react";

import { ChatMessage } from "@/features/chat-message";
import { ChatFrame, ChatMessageFrame } from "@/features/main-app-box";
import { ProfileToolbar } from "@/features/chat-box/profile-toolbar";

import { Pill } from "@/components/pill";
import { Rounded } from "@/components/rounded";
import { Text } from "@/components/text";
import { useChat } from "@/hooks/use-chat";
import { useUseWorkspaceMutation } from "@/mutations/user";
import { ColorPalette } from "@/features/color-palette";
import { useState } from "react";
import { useUserSettings } from "@/hooks/use-user-settings";
import { zinc100, zinc200, zinc300 } from "@/constants/theme";
import { processEnv } from "@/utils/env";

const WorkspaceMessage = ({
  message,
}: {
  message: UseChatHelpers["messages"][number];
}) => {
  const [color, setColor] = useState<string | undefined>();

  const userSettings = useUserSettings();

  const useWorkspaceMutation = useUseWorkspaceMutation({
    onSuccess: async () => {
      console.log("Workspace updated");
      userSettings.invalidateWorkspaceUrl();
      await userSettings.invalidate();
    },
  });

  const [toolInv] = message.parts.filter(
    (p) =>
      p.type === "tool-invocation" &&
      p.toolInvocation.toolName === "generateImage"
  );

  const response =
    toolInv?.type === "tool-invocation" &&
    toolInv.toolInvocation.state === "result"
      ? (toolInv.toolInvocation as {
          result: { key: string };
          args: { prompt: string };
        })
      : undefined;

  return (
    <ChatMessage
      messageId={message.id}
      content={message.content || response?.args.prompt}
      role={message.role === "assistant" ? "Assistant" : "User"}
      actions={
        message.role === "assistant" && response?.result.key ? (
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pill
              variant="filled"
              noText
              onPress={() => {
                if (!color) return;

                useWorkspaceMutation.mutate({
                  key: response?.result.key,
                  color,
                });
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  paddingVertical: 2.5,
                  paddingHorizontal: 10,
                }}
              >
                {color ? (
                  <>
                    <CursorClick size={14} color="#fff" />
                    <Text style={{ color: "#fff" }} fontSize="sm">
                      {useWorkspaceMutation.isPending
                        ? "..."
                        : "Use as workspace"}
                    </Text>
                  </>
                ) : null}
                {!color ? (
                  <>
                    <View style={{ flexDirection: "row" }}>
                      <Circle color={zinc300} weight="fill" />
                      <Circle
                        color={zinc200}
                        style={{ marginLeft: -15 }}
                        weight="fill"
                      />
                      <Circle
                        color={zinc100}
                        style={{ marginLeft: -15 }}
                        weight="fill"
                      />
                    </View>
                    <Text style={{ color: "#fff" }} fontSize="sm">
                      Pick a color
                    </Text>
                  </>
                ) : null}
              </View>
            </Pill>
          </View>
        ) : null
      }
    >
      {response ? (
        <Text>
          <Rounded
            size="2xl"
            style={{
              padding: 5,
              backgroundColor: "#ffffff",
              marginTop: 10,
              transform: [{ rotate: "2deg" }],
            }}
          >
            <Image
              source={{
                uri: `${processEnv.EXPO_PUBLIC_API_URL}/api/workspace/${response.result.key}`,
              }}
              style={{
                borderRadius: "13px",
                height: 125,
                width: 125,
              }}
            />
          </Rounded>
        </Text>
      ) : null}

      {response?.result.key ? (
        <ColorPalette
          src={`${processEnv.EXPO_PUBLIC_API_URL}/api/workspace/${response.result.key}`}
          onSelected={setColor}
        />
      ) : null}
    </ChatMessage>
  );
};

export default function WorkspacePage() {
  const userSettings = useUserSettings();

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    chatId: Crypto.randomUUID(),
    path: `/user/workspace/generate`,
  });

  return (
    <ChatFrame
      toolbar={<ProfileToolbar />}
      value={input}
      onChange={(ev) => {
        handleInputChange({
          ...ev,
          target: {
            ...ev.target,
            value: ev.nativeEvent.text,
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      }}
      onSubmit={handleSubmit}
    >
      <ScrollView>
        <ChatMessageFrame style={{ paddingBottom: 200 }}>
          <ChatMessage
            messageId="static"
            content="Hi there! let's update your workspace image. You can prompt me to generate a new image, note: this session is not saved."
            role="Assistant"
          >
            <Text>
              <Rounded
                size="2xl"
                style={{
                  padding: 5,
                  backgroundColor: "#ffffff",
                  marginTop: 10,
                  transform: [{ rotate: "2deg" }],
                }}
              >
                <Image
                  source={{
                    uri: "http://localhost:8787/api/workspace/sxrmqobrfiq2e76en6su4t49",
                  }}
                  style={{
                    borderRadius: "13px",
                    height: 125,
                    width: 125,
                  }}
                />
              </Rounded>
            </Text>

            <ColorPalette
              src="http://localhost:8787/api/workspace/sxrmqobrfiq2e76en6su4t49"
              defaultColor={userSettings.colorSettings.base}
              isSavedPalette
            />
          </ChatMessage>
          {messages.map((m) => (
            <WorkspaceMessage key={m.id} message={m} />
          ))}
        </ChatMessageFrame>
      </ScrollView>
    </ChatFrame>
  );
}
