import { Pill } from "@/components/pill";
import { Rounded } from "@/components/rounded";
import { Text } from "@/components/text";
import { TextInput } from "@/components/text-input";
import { sky50 } from "@/constants/theme";
import { ChatMessage } from "@/features/chat-message";
import { FloppyDisk } from "phosphor-react-native";
import { View } from "react-native";

export default function BioPage() {
  return (
    <View>
      <ChatMessage
        role="Assistant"
        actions={
          <View style={{ flexDirection: "row" }}>
            <Pill variant="filled" noText>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  paddingVertical: 2.5,
                  paddingHorizontal: 10,
                  alignItems: "center",
                }}
              >
                <FloppyDisk size={18} color="#fff" />
                <Text style={{ color: "#fff" }}>Save</Text>
              </View>
            </Pill>
          </View>
        }
      >
        <View style={{ flexDirection: "column", gap: 5 }}>
          <Text style={{ marginLeft: 10 }}>Username</Text>
          <Rounded
            style={{
              padding: 20,
              backgroundColor: "#ffffff",
              borderWidth: 2,
              borderColor: sky50,
            }}
          >
            <TextInput placeholder="Display Name (Name & Surname)" />
          </Rounded>

          <Text style={{ marginLeft: 10, marginTop: 10 }}>
            Biograph (Public)?
          </Text>
          <Rounded
            style={{
              padding: 20,
              backgroundColor: "#ffffff",
              borderWidth: 2,
              borderColor: sky50,
            }}
          >
            <TextInput
              multiline
              numberOfLines={8}
              placeholder="Explain yourself in a few words (This is public)"
            />
          </Rounded>
        </View>
      </ChatMessage>
    </View>
  );
}
