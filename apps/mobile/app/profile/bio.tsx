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
import { ChatFrame, ChatMessageFrame } from "@/features/main-app-box";
import { ProfileToolbar } from "@/features/chat-box/profile-toolbar";

export default function BioPage() {
  const userBioQuery = useUserBioQuery();
  const userBioMutation = useUserBioMutation();

  const form = useForm({
    defaultValues: {
      displayName: userBioQuery.data?.displayName ?? "",
      description: userBioQuery.data?.description ?? "",
      username: userBioQuery.data?.username ?? "",
    },
  });

  return (
    <ChatFrame toolbar={<ProfileToolbar />}>
      <ChatMessageFrame>
        <ChatMessage
          messageId="bio-starter"
          role="Assistant"
          actions={
            <View style={{ flexDirection: "row" }}>
              <form.Subscribe
                selector={(state) => [
                  state.values.displayName,
                  state.values.description,
                  state.values.username,
                ]}
                children={([displayName, description, username]) => (
                  <Pill
                    variant="filled"
                    noText
                    onPress={() => {
                      userBioMutation.mutate({
                        description,
                        displayName,
                        username,
                      });
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
              Username
            </Text>

            <form.Field
              name="username"
              children={(field) => (
                <Rounded
                  style={{
                    padding: 10,
                    backgroundColor: "#ffffff",
                    borderWidth: 2,
                    borderColor: sky50,
                  }}
                  size="lg"
                >
                  <TextInput
                    placeholder="@username"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                  />
                </Rounded>
              )}
            />

            <Text style={{ marginLeft: 10 }} fontSize="sm">
              Display Name
            </Text>

            <form.Field
              name="displayName"
              children={(field) => (
                <Rounded
                  style={{
                    padding: 10,
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
                    padding: 10,
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
      </ChatMessageFrame>
    </ChatFrame>
  );
}
