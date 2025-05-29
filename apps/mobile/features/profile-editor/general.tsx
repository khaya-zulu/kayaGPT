import { View } from "react-native";

import { Flag, Hash, VideoConference } from "phosphor-react-native";
import { useUserSettings } from "@/hooks/use-user-settings";
import { ReactNode } from "react";
import { profileFormOpts, withForm } from "./form";

import { Text } from "@/components/text";

export const ProfileGeneral = withForm({
  ...profileFormOpts,
  props: {
    flag: undefined as string | undefined,
  },
  render: ({ form, flag }) => {
    return (
      <View>
        <form.AppField
          name="general.username"
          children={(field) => (
            <field.Input icon={<Hash size={18} />} placeholder="Username" />
          )}
        />
        <form.AppField
          name="general.displayName"
          children={(field) => (
            <field.Input
              icon={<VideoConference size={18} />}
              placeholder="Display Name"
            />
          )}
        />
        <form.AppField
          name="general.regionName"
          children={(field) => (
            <field.Input
              icon={flag ? <Text>{flag}</Text> : <Flag size={18} />}
              placeholder="Country"
            />
          )}
        />
      </View>
    );
  },
});
