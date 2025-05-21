import { View } from "react-native";

import { Rounded } from "@/components/rounded";
import { Text } from "@/components/text";
import { zinc200 } from "@/constants/theme";
import { GithubLogo, Globe, LinkedinLogo, XLogo } from "phosphor-react-native";
import { TextInput } from "@/components/text-input";
import { Pill } from "@/components/pill";
import { useForm } from "@tanstack/react-form";
import { useUpdateSocialLinksMutation } from "@/mutations/user";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { chatHistoryQueryKey } from "@/queries/chat";

export const SocialTool = (props: {
  socialLinks: { github: string; linkedin: string; x: string; website: string };
}) => {
  const router = useRouter();

  const utils = useQueryClient();

  const { chatId } = useLocalSearchParams<{ chatId: string }>();

  const form = useForm({
    defaultValues: props.socialLinks,
  });

  const updateSocialLinksMutation = useUpdateSocialLinksMutation({
    onSuccess: async (_, vars) => {
      if (vars.deleteChatMessageId) {
        await utils.invalidateQueries({ queryKey: chatHistoryQueryKey });
        router.push("/");
      }
    },
  });

  const isLoadingAndDeleting =
    updateSocialLinksMutation.isPending &&
    !!updateSocialLinksMutation.variables.deleteChatMessageId;

  const isLoading =
    updateSocialLinksMutation.isPending && !isLoadingAndDeleting;

  return (
    <View style={{ flexDirection: "column", gap: 10 }}>
      <Rounded
        size={20}
        style={{
          padding: 5,
          backgroundColor: "#fff",
          width: "80%",
          marginTop: 10,
          transform: [{ translateX: -5 }],
        }}
      >
        <Rounded
          style={{
            backgroundColor: "#ffffff",
            borderWidth: 1,
            borderColor: zinc200 + "cc",
          }}
        >
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderColor: zinc200 + "cc",
            }}
          >
            <Text fontSize="sm">Social Links</Text>
          </View>

          <View style={{ flexDirection: "column", gap: 5, padding: 10 }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Rounded
                size="full"
                style={{
                  padding: 5,
                  backgroundColor: "#ffffff",
                  borderColor: zinc200 + "cc",
                  borderWidth: 2,
                }}
              >
                <GithubLogo size={14} />
              </Rounded>

              <form.Field
                name="github"
                children={(field) => (
                  <TextInput
                    placeholder="Github"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    style={{ flex: 1 }}
                  />
                )}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <Rounded
                size="full"
                style={{
                  padding: 5,
                  backgroundColor: "#ffffff",
                  borderColor: zinc200 + "cc",
                  borderWidth: 2,
                }}
              >
                <XLogo size={14} />
              </Rounded>

              <form.Field
                name="x"
                children={(field) => (
                  <TextInput
                    placeholder="X"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    style={{ flex: 1 }}
                  />
                )}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <Rounded
                size="full"
                style={{
                  padding: 5,
                  backgroundColor: "#ffffff",
                  borderColor: zinc200 + "cc",
                  borderWidth: 2,
                }}
              >
                <LinkedinLogo size={14} />
              </Rounded>

              <form.Field
                name="linkedin"
                children={(field) => (
                  <TextInput
                    placeholder="Linkedin"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    style={{ flex: 1 }}
                  />
                )}
              />
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Rounded
                size="full"
                style={{
                  padding: 5,
                  backgroundColor: "#ffffff",
                  borderColor: zinc200 + "cc",
                  borderWidth: 2,
                }}
              >
                <Globe size={14} />
              </Rounded>

              <form.Field
                name="website"
                children={(field) => (
                  <TextInput
                    placeholder="Personal Site"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    style={{ flex: 1 }}
                  />
                )}
              />
            </View>
          </View>
        </Rounded>
      </Rounded>

      <form.Subscribe
        selector={(state) => state.values}
        children={(state) => {
          return (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pill
                variant="filled"
                noText
                onPress={() => {
                  updateSocialLinksMutation.mutate(state);
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <Text style={{ color: "#fff" }} fontSize="sm">
                    {isLoading ? "Saving..." : "Save"}
                  </Text>
                </View>
              </Pill>
              <Pill
                variant="filled"
                noText
                onPress={() => {
                  updateSocialLinksMutation.mutate({
                    ...state,
                    deleteChatMessageId: chatId,
                  });
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <Text style={{ color: "#fff" }} fontSize="sm">
                    {isLoadingAndDeleting
                      ? "Deleting..."
                      : "Save & Delete Message"}
                  </Text>
                </View>
              </Pill>
            </View>
          );
        }}
      />
    </View>
  );
};
