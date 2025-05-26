import { useState } from "react";

import { View, Image } from "react-native";
import { FloppyDisk, ImageSquare } from "phosphor-react-native";
import * as ImagePicker from "expo-image-picker";

import { ChatMessage } from "@/features/chat-message";

import { Pill } from "@/components/pill";
import { Rounded } from "@/components/rounded";
import { Text } from "@/components/text";
import { ChatFrame, ChatMessageFrame } from "@/features/main-app-box";
import { ProfileToolbar } from "@/features/chat-box/profile-toolbar";
import { client } from "@/utils/client";
import { useAuth } from "@clerk/clerk-expo";
import { processEnv } from "@/utils/env";

const PicturePrompt = ({
  content,
  image,
  id,
  onUpload,
  onSave,
}: {
  content: string;
  image: string;
  id: string;
  onUpload?: () => void;
  onSave?: () => void;
}) => {
  return (
    <ChatMessage
      messageId={id}
      content={content}
      role="Assistant"
      actions={
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pill variant="filled" noText onPress={onUpload ?? onSave}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingVertical: 2.5,
                paddingHorizontal: 10,
              }}
            >
              {onUpload ? (
                <ImageSquare size={18} color="#fff" />
              ) : (
                <FloppyDisk size={18} color="#fff" />
              )}
              <Text fontSize="sm" style={{ color: "#fff" }}>
                {onUpload ? "Upload" : "Save as profile picture"}
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
              uri: image,
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
  );
};

export default function ProfilePage() {
  const { getToken } = useAuth();
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  return (
    <ChatFrame toolbar={<ProfileToolbar />}>
      <ChatMessageFrame>
        <PicturePrompt
          id="first-image"
          content="Want to update your profile picture?"
          image={`${processEnv.EXPO_PUBLIC_API_URL}/api/user/profile/sxrmqobrfiq2e76en6su4t49`}
          onUpload={pickImage}
        />

        {image ? (
          <PicturePrompt
            id="second-image"
            content="Uploading your profile picture..."
            image={image.uri}
            onSave={async () => {
              if (!image || isUploading || !image.file) return;

              setIsUploading(true);

              const formData = new FormData();

              formData.append("file", image.file);

              await fetch(
                `${processEnv.EXPO_PUBLIC_API_URL}${client.api.user.profile.upload.$url().pathname}`,
                {
                  method: "POST",
                  body: formData,
                  headers: {
                    // "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${await getToken()}`,
                  },
                }
              );

              setIsUploading(false);
            }}
          />
        ) : null}
      </ChatMessageFrame>
    </ChatFrame>
  );
}
