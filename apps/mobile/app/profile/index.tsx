import { View, Image } from "react-native";
import { ImageSquare } from "phosphor-react-native";

import { ChatMessage } from "@/features/chat-message";

import { Pill } from "@/components/pill";
import { Rounded } from "@/components/rounded";
import { Text } from "@/components/text";

export default function ProfilePage() {
  return (
    <>
      <ChatMessage
        messageId="static"
        content="Want to update your profile picture?"
        role="Assistant"
        actions={
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pill noText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  paddingVertical: 2.5,
                }}
              >
                <ImageSquare size={20} />
                <Text>Upload</Text>
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
                uri: "https://pbs.twimg.com/profile_images/1830330700920201220/tQz0-0Xq_400x400.jpg",
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
