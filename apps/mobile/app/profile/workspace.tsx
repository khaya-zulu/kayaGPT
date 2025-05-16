import { View, Image, ScrollView } from "react-native";
import { ImageSquare } from "phosphor-react-native";

import * as Crypto from "expo-crypto";

import { ChatMessage } from "@/features/chat-message";
import { ChatFrame, ChatMessageFrame } from "@/features/main-app-box";
import { ProfileToolbar } from "@/features/chat-box/profile-toolbar";

import { Pill } from "@/components/pill";
import { Rounded } from "@/components/rounded";
import { Text } from "@/components/text";
import { useChat } from "@/hooks/use-chat";
import { useUseWorkspaceMutation } from "@/mutations/user";

export default function WorkspacePage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    chatId: Crypto.randomUUID(),
    path: `/user/workspace/generate`,
  });

  const useWorkspaceMutation = useUseWorkspaceMutation();

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
                    // uri: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  }}
                  style={{
                    borderRadius: "13px",
                    height: 125,
                    width: 125,
                  }}
                />
              </Rounded>
            </Text>
          </ChatMessage>
          {messages.map((m) => {
            const [toolInv] = m.parts.filter(
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
                messageId={m.id}
                content={m.content || response?.args.prompt}
                role={m.role === "assistant" ? "Assistant" : "User"}
                actions={
                  m.role === "assistant" && response?.result.key ? (
                    <View style={{ flexDirection: "row", gap: 10 }}>
                      <Pill
                        variant="filled"
                        noText
                        onPress={() => {
                          useWorkspaceMutation.mutate({
                            key: response?.result.key,
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
                          <ImageSquare size={18} color="#fff" />
                          <Text style={{ color: "#fff" }} fontSize="sm">
                            Use as workspace
                          </Text>
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
                          uri: `http://localhost:8787/api/workspace/${response.result.key}`,
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
              </ChatMessage>
            );
          })}
        </ChatMessageFrame>
      </ScrollView>
    </ChatFrame>
  );
}
