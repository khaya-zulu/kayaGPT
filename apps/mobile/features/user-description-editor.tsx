import { Pill } from "@/components/pill";
import { Rounded } from "@/components/rounded";
import { Text } from "@/components/text";
import { TextInput } from "@/components/text-input";
import { useUserSettings } from "@/hooks/use-user-settings";
import { useUpdateUserDescriptionMutation } from "@/mutations/user";
import { useUserDescriptionQuery } from "@/queries/users";
import { useForm } from "@tanstack/react-form";
import { BlurView } from "expo-blur";
import { ArrowLeft } from "phosphor-react-native";
import { Pressable, View } from "react-native";

export const UserDescriptionEditor = ({ onClose }: { onClose: () => void }) => {
  const userSettings = useUserSettings();

  const userDescriptionQuery = useUserDescriptionQuery();
  const userUpdateDescriptionMutation = useUpdateUserDescriptionMutation();

  const userDescription = userDescriptionQuery.data;

  const form = useForm({
    defaultValues: {
      description: userDescription?.description ?? "",
    },
  });

  return (
    <View style={{ flex: 0.5, width: 300 }}>
      <BlurView style={{ flex: 1, padding: 10 }} tint="prominent">
        <Rounded style={{ flex: 1, backgroundColor: "#fff" }}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderBottomColor: userSettings.colorSettings[100] + "80",
              borderBottomWidth: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <Pressable onPress={() => onClose()}>
                <ArrowLeft size={14} weight="bold" />
              </Pressable>
              <Text fontSize="sm">Update profile description</Text>
            </View>
            <form.Subscribe
              selector={(state) => [state.values.description]}
              children={([description]) => (
                <Pill
                  variant="primary"
                  onPress={() => {
                    userUpdateDescriptionMutation.mutate({
                      description,
                    });
                  }}
                >
                  <View style={{ paddingHorizontal: 10, paddingVertical: 2.5 }}>
                    <Text fontSize="sm">
                      {userUpdateDescriptionMutation.isPending ? "..." : "Save"}
                    </Text>
                  </View>
                </Pill>
              )}
            />
          </View>

          <View style={{ padding: 20 }}>
            <form.Field
              name="description"
              children={(field) => (
                <TextInput
                  multiline
                  numberOfLines={40}
                  placeholder="Describe yourself..."
                  onChangeText={field.handleChange}
                  value={field.state.value}
                />
              )}
            />
          </View>
        </Rounded>
      </BlurView>
    </View>
  );
};
