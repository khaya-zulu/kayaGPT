import { Rounded } from "@/components/rounded";
import { Text } from "@/components/text";
import { useUserSettings } from "@/hooks/use-user-settings";
import { useState, useTransition } from "react";
import { Image, View } from "react-native";

import * as ImagePicker from "expo-image-picker";
import { Pill } from "@/components/pill";
import { processEnv } from "@/utils/env";
import { client } from "@/utils/client";
import { useAuth } from "@clerk/clerk-expo";

const AvatarBox = ({ url, size = 125 }: { url: string; size?: number }) => {
  return (
    <Rounded
      size="2xl"
      style={[
        {
          padding: 5,
          backgroundColor: "#ffffff",
        },
      ]}
    >
      <Rounded size={13} style={{ overflow: "hidden" }}>
        <Image
          source={{
            uri: url,
          }}
          style={{
            height: size,
            width: size,
            borderWidth: 1,
          }}
        />
      </Rounded>
    </Rounded>
  );
};

export const UserAvatarTool = ({}) => {
  const { avatarUrl, invalidateImage } = useUserSettings();

  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isPending, startTransition] = useTransition();

  const { getToken } = useAuth();

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

  const onSave = async () => {
    startTransition(async () => {
      if (!image || !image.file) return;

      const formData = new FormData();
      formData.append("file", image.file);

      await fetch(
        `${processEnv.EXPO_PUBLIC_API_URL}${client.api.user.profile.upload.$url().pathname}`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      startTransition(async () => {
        await invalidateImage("avatar");
        setImage(null);
      });
    });
  };

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <AvatarBox url={image ? image.uri : avatarUrl} />
        {image ? (
          <View
            style={{
              justifyContent: "flex-end",
              transform: [{ translateX: -20 }, { rotate: "2deg" }],
            }}
          >
            <AvatarBox url={avatarUrl} size={100} />
          </View>
        ) : null}
      </View>

      <View style={{ marginTop: 10, flexDirection: "row", gap: 10 }}>
        <Pill noText variant="filled" onPress={pickImage}>
          <View style={{ paddingHorizontal: 10 }}>
            <Text style={{ color: "#fff" }}>Upload</Text>
          </View>
        </Pill>
        <Pill variant="primary" onPress={onSave}>
          <Text>{isPending ? "..." : "Save"}</Text>
        </Pill>
      </View>
    </View>
  );
};
