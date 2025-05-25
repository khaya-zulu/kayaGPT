import { View } from "react-native";

import { Text } from "@/components/text";
import { TextInput } from "@/components/text-input";
import { Pill } from "@/components/pill";

import { useForm } from "@tanstack/react-form";
import { useUsernameExistsMutation } from "@/mutations/user";

import { Card } from "../card";
import { SealWarning } from "phosphor-react-native";
import { rose600 } from "@/constants/theme";

export const UsernameTool = ({ username }: { username: string }) => {
  const form = useForm({
    defaultValues: {
      username,
    },
  });

  const usernameExistsMutation = useUsernameExistsMutation();
  const usernameUpdateMutation = useUsernameExistsMutation();

  return (
    <View
      style={{
        flexDirection: "column",
        gap: 10,
        transform: [{ translateX: -5 }],
      }}
    >
      <form.Field
        name="username"
        validators={{
          onChangeAsyncDebounceMs: 350,
          onChangeAsync: async ({ value }) => {
            const { exists } = await usernameExistsMutation.mutateAsync({
              username: value,
            });

            return exists ? "Username already exists" : undefined;
          },
        }}
        children={(field) => {
          return (
            <Card
              header={
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text fontSize="sm">Username</Text>

                  {!usernameExistsMutation.isPending &&
                  field.state.meta.errors[0] ? (
                    <SealWarning size={18} color={rose600} weight="bold" />
                  ) : null}
                  {usernameExistsMutation.isPending ? (
                    <Text fontSize="sm">checking...</Text>
                  ) : null}
                </View>
              }
            >
              <TextInput
                placeholder="kaya_was_taken"
                onChangeText={field.handleChange}
                value={field.state.value}
              />
            </Card>
          );
        }}
      />

      <form.Subscribe
        selector={(state) => ({
          username: state.values.username,
          isFieldsValid: state.isFieldsValid,
        })}
        children={({ username, isFieldsValid }) => (
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pill
              noText
              variant="filled"
              onPress={() => {
                if (!username || !isFieldsValid) {
                  return;
                }
                usernameUpdateMutation.mutateAsync({ username });
              }}
            >
              <View
                style={{ paddingHorizontal: 10, flexDirection: "row", gap: 10 }}
              >
                <Text style={{ color: "#ffffff" }}>
                  {usernameUpdateMutation.isPending ? "..." : "Save"}
                </Text>
              </View>
            </Pill>
          </View>
        )}
      />
    </View>
  );
};
