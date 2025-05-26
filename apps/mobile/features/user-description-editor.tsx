import { Pill } from "@/components/pill";
import { Rounded } from "@/components/rounded";
import { Text } from "@/components/text";
import { useUserSettings } from "@/hooks/use-user-settings";
import { useUpdateUserDescriptionMutation } from "@/mutations/user";
import { useUserDescriptionQuery } from "@/queries/users";
import { BlurView } from "expo-blur";
import { ArrowLeft, ImageSquare } from "phosphor-react-native";
import {
  KeyboardAvoidingView,
  Pressable,
  View,
  ScrollView,
} from "react-native";

import {
  CodeBridge,
  RichText,
  TenTapStartKit,
  Toolbar,
  useEditorBridge,
  ImageBridge,
} from "@10play/tentap-editor";

import * as ImagePicker from "expo-image-picker";
import { client } from "@/utils/client";
import { useAuth } from "@clerk/clerk-expo";
import { base46FontSpaceGrotesk } from "@/utils/font-base64";

import showdown from "showdown";
import { useWatch } from "@/hooks/use-watch";
import { processEnv } from "@/utils/env";

export const UserDescriptionEditor = ({ onClose }: { onClose: () => void }) => {
  const userSettings = useUserSettings();

  const { getToken } = useAuth();

  const userDescriptionQuery = useUserDescriptionQuery();
  const userUpdateDescriptionMutation = useUpdateUserDescriptionMutation();

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    bridgeExtensions: [
      ...TenTapStartKit,
      ImageBridge.configureExtension({
        inline: true,
      }),
      CodeBridge.configureCSS(
        `
        ${base46FontSpaceGrotesk}
        * {
          font-family: "Space Grotesk", sans-serif;
        }

        img {
          width: 150px !important;
          height: 150px !important;
          object-fit: cover;
          border-radius: 15px;
        }
        `
      ),
    ],
  });

  useWatch(userDescriptionQuery.data, (prev, curr) => {
    if (curr?.description && curr.description !== prev?.description) {
      ImageBridge.configureExtension({ inline: false });

      const converter = new showdown.Converter();
      const html = converter.makeHtml(curr.description);

      editor.setContent(html);
    }
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
            <Pill
              variant="primary"
              onPress={async () => {
                const description = await editor.getHTML();
                const converter = new showdown.Converter();

                const markdownDescription = converter.makeMarkdown(description);

                userUpdateDescriptionMutation.mutate({
                  description: markdownDescription,
                });
              }}
            >
              <View style={{ paddingHorizontal: 10, paddingVertical: 2.5 }}>
                <Text fontSize="sm">
                  {userUpdateDescriptionMutation.isPending ? "..." : "Save"}
                </Text>
              </View>
            </Pill>
          </View>

          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              flex: 1,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <RichText editor={editor} />
            <KeyboardAvoidingView
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  borderTopWidth: 1,
                  borderTopColor: userSettings.colorSettings[100] + "80",
                  paddingVertical: 20,
                  alignItems: "center",
                }}
              >
                <ScrollView
                  style={{ flex: 1 }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  <View>
                    <Toolbar editor={editor} />
                  </View>
                </ScrollView>
                <View style={{ paddingRight: 20 }}>
                  <Pressable
                    onPress={async () => {
                      const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ["images"],
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 1,
                      });

                      const formData = new FormData();

                      const image = result.assets?.[0];
                      if (image && image.file) {
                        formData.append("file", image.file);

                        const response = await fetch(
                          `${processEnv.EXPO_PUBLIC_API_URL}${client.api.user.profile.description.upload.$url().pathname}`,
                          {
                            method: "POST",
                            body: formData,
                            headers: {
                              Authorization: `Bearer ${await getToken()}`,
                            },
                          }
                        );

                        const data = await response.json();

                        editor.setImage(
                          `${processEnv.EXPO_PUBLIC_API_URL}/api/user/${data.key}`
                        );
                      }
                    }}
                  >
                    <ImageSquare />
                  </Pressable>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Rounded>
      </BlurView>
    </View>
  );
};
