import { View } from "react-native";
import { FloppyDisk } from "phosphor-react-native";
import { useForm } from "@tanstack/react-form";

import { Pill } from "@/components/pill";
import { Rounded } from "@/components/rounded";
import { Text } from "@/components/text";
import { TextInput } from "@/components/text-input";
import { sky50 } from "@/constants/theme";
import { ChatMessage } from "@/features/chat-message";

import { useUserBioQuery } from "@/queries/users";
import { useUserBioMutation } from "@/mutations/user";

export default function BioPage() {
  const userBioQuery = useUserBioQuery();
  const userBioMutation = useUserBioMutation();

  //   Hi my name is Khaya Zulu,

  // I'm design engineer based in Johannesburg, South Africa 🇿🇦. I enjoy building stuff. This my personal gpt.

  const form = useForm({
    defaultValues: {
      displayName: userBioQuery.data?.displayName ?? "",
      description: userBioQuery.data?.description ?? "",
    },
  });

  return (
    <View>
      <ChatMessage
        role="Assistant"
        actions={
          <View style={{ flexDirection: "row" }}>
            <form.Subscribe
              selector={(state) => [
                state.values.displayName,
                state.values.description,
              ]}
              children={([displayName, description]) => (
                <Pill
                  variant="filled"
                  noText
                  onPress={() => {
                    userBioMutation.mutate({ description, displayName });
                  }}
                >
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
                    <Text style={{ color: "#fff" }}>
                      {userBioMutation.isPending ? "..." : "Save"}
                    </Text>
                  </View>
                </Pill>
              )}
            />
          </View>
        }
      >
        <View style={{ flexDirection: "column", gap: 5 }}>
          <Text style={{ marginLeft: 10 }} fontSize="sm">
            Display Name
          </Text>

          <form.Field
            name="displayName"
            children={(field) => (
              <Rounded
                style={{
                  padding: 15,
                  backgroundColor: "#ffffff",
                  borderWidth: 2,
                  borderColor: sky50,
                }}
                size="lg"
              >
                <TextInput
                  placeholder="Name & Surname"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                />
              </Rounded>
            )}
          />

          <Text style={{ marginLeft: 10, marginTop: 10 }} fontSize="sm">
            Biograph (Public)?
          </Text>

          <form.Field
            name="description"
            children={(field) => (
              <Rounded
                style={{
                  padding: 15,
                  backgroundColor: "#ffffff",
                  borderWidth: 2,
                  borderColor: sky50,
                }}
                size="lg"
              >
                <TextInput
                  multiline
                  numberOfLines={8}
                  placeholder="Explain yourself in a few words (This is public)"
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  value={field.state.value}
                />
              </Rounded>
            )}
          />
        </View>
      </ChatMessage>
    </View>
  );
}
