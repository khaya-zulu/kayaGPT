import { View, Image } from "react-native";
import { ImageSquare } from "phosphor-react-native";

import { ChatMessage } from "@/features/chat-message";

import { Pill } from "@/components/pill";
import { Rounded } from "@/components/rounded";
import { Text } from "@/components/text";

export default function WorkspacePage() {
  return (
    <>
      <ChatMessage
        messageId="static"
        content="Want to update your profile picture?"
        role="Assistant"
        actions={
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pill variant="filled" noText>
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
                  Upload
                </Text>
              </View>
            </Pill>
          </View>
        }
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
                uri: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    </>
  );
}
