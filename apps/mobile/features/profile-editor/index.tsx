import { useMemo, useRef, useState } from "react";

import { Button } from "@/components/button";
import { Rounded } from "@/components/rounded";
import { Text } from "@/components/text";
import { useUserSettings } from "@/hooks/use-user-settings";
import { useUserProfileSettingsMutation } from "@/mutations/user";
import {
  userProfileSettingsQueryKey,
  useUserProfileSettingsQuery,
} from "@/queries/users";
import { BlurView } from "expo-blur";
import { ArrowDown, ArrowLeft } from "phosphor-react-native";
import { Pressable, View } from "react-native";

import showdown from "showdown";
import { ProfileDescription } from "./description";
import { ProfileGeneral } from "./general";
import { ProfileSocial } from "./social";

import { useAppForm, profileFormOpts } from "./form";
import type { EditorBridge } from "@10play/tentap-editor";
import { useQueryClient } from "@tanstack/react-query";
import { isWeb } from "@/constants/platform";

type Tab = "general" | "description" | "social";

export const ProfileEditor = ({
  tab,
  onClose,
}: {
  tab: "general" | "description" | "social";
  onClose: () => void;
}) => {
  const userSettings = useUserSettings();

  const utils = useQueryClient();

  const editorRef = useRef<EditorBridge>(null);

  const userProfileSettingsQuery = useUserProfileSettingsQuery();
  const userProfileSettingsMutation = useUserProfileSettingsMutation({
    onSuccess: () => {
      return utils.invalidateQueries({ queryKey: userProfileSettingsQueryKey });
    },
  });

  const [activeTab, setActiveTab] = useState<Tab>(tab);

  const profileSettings = userProfileSettingsQuery.data;

  const form = useAppForm({
    ...profileFormOpts,
    defaultValues: {
      general: {
        username: profileSettings?.username ?? "",
        displayName: profileSettings?.displayName ?? "",
        regionName: profileSettings?.region.name ?? "",
      },
      social: {
        github: profileSettings?.social?.github ?? "",
        linkedin: profileSettings?.social?.linkedin ?? "",
        website: profileSettings?.social?.website ?? "",
        x: profileSettings?.social?.x ?? "",
      },
    },
    onSubmit: async ({ value }) => {
      let markdownDescription = profileSettings?.description ?? "";

      if (editorRef.current) {
        const description = await editorRef.current.getHTML();
        const converter = new showdown.Converter();

        markdownDescription = converter.makeMarkdown(description);
      }

      userProfileSettingsMutation.mutate({
        description: markdownDescription,
        username: value.general.username,
        displayName: value.general.displayName,
        regionName: value.general.regionName,
        social: {
          github: value.social.github,
          linkedin: value.social.linkedin,
          website: value.social.website,
          x: value.social.x,
        },
      });
    },
  });

  const defaultHtml = useMemo(() => {
    if (!profileSettings?.description) return "";

    const converter = new showdown.Converter();
    const html = converter.makeHtml(profileSettings.description);

    return html;
  }, [profileSettings?.description]);

  return (
    <View style={isWeb ? { flex: 0.5, width: 300 } : { flex: 1 }}>
      <BlurView style={{ flex: 1, padding: isWeb ? 10 : 0 }} tint="prominent">
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
                {isWeb ? (
                  <ArrowLeft size={14} weight="bold" />
                ) : (
                  <ArrowDown size={14} weight="bold" />
                )}
              </Pressable>
              <Text fontSize="sm">Profile</Text>
            </View>
            <form.Subscribe
              selector={(state) => state.values}
              children={() => (
                <Button
                  variant="filled"
                  padding={{ horizontal: 10, vertical: 2.5 }}
                  onPress={() => form.handleSubmit()}
                >
                  <Text fontSize="sm" style={{ color: "#fff" }}>
                    {userProfileSettingsMutation.isPending ? "..." : "Save"}
                  </Text>
                </Button>
              )}
            />
          </View>

          <View
            style={{
              borderBottomColor: userSettings.colorSettings[100] + "80",
              borderBottomWidth: 1,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingVertical: 10,
              gap: 10,
            }}
          >
            {(userSettings.isOnboardingComplete
              ? ["General", "Description", "Social"]
              : ["Description"]
            ).map((t) => (
              <Button
                variant={activeTab === t.toLowerCase() ? "primary" : "white"}
                onPress={() => setActiveTab(t.toLowerCase() as Tab)}
                key={t}
                padding={{ horizontal: 10, vertical: 2.5 }}
              >
                <Text fontSize="sm">{t}</Text>
              </Button>
            ))}
          </View>

          {activeTab === "general" ? (
            <ProfileGeneral flag={profileSettings?.region.flag} form={form} />
          ) : null}
          {activeTab === "description" ? (
            <ProfileDescription defaultHtml={defaultHtml} ref={editorRef} />
          ) : null}
          {activeTab === "social" ? <ProfileSocial form={form} /> : null}
        </Rounded>
      </BlurView>
    </View>
  );
};
