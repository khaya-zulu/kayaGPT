import { useUserSettings } from "@/hooks/use-user-settings";
import { ImageSquare } from "phosphor-react-native";
import {
  KeyboardAvoidingView,
  Pressable,
  View,
  ScrollView,
} from "react-native";

import {
  CodeBridge,
  ImageBridge,
  TenTapStartKit,
  useEditorBridge,
  RichText,
  Toolbar,
  EditorBridge,
} from "@10play/tentap-editor";

import * as ImagePicker from "expo-image-picker";
import { client } from "@/utils/client";
import { useAuth } from "@clerk/clerk-expo";

import { processEnv } from "@/utils/env";
import { base46FontSpaceGrotesk } from "@/utils/font-base64";
import { RefObject, useImperativeHandle } from "react";

export const ProfileDescription = ({
  ref,
  defaultHtml,
}: {
  ref: RefObject<EditorBridge | null>;
  defaultHtml: string;
}) => {
  const userSettings = useUserSettings();

  const { getToken } = useAuth();

  const handleImageUpload = async () => {
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

      editor.setImage(`${processEnv.EXPO_PUBLIC_API_URL}/api/user/${data.key}`);
    }
  };

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: defaultHtml,
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
              font-size: 14px;
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

  useImperativeHandle(ref, () => editor);

  return (
    <View
      style={{
        paddingHorizontal: 20,
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
            <Pressable onPress={handleImageUpload}>
              <ImageSquare />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
