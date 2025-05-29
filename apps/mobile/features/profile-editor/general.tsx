import { View } from "react-native";

import {
  Flag,
  Hash,
  SealWarning,
  VideoConference,
} from "phosphor-react-native";
import { ReactNode } from "react";
import { profileFormOpts, withForm } from "./form";

import { Text } from "@/components/text";
import { useUsernameExistsMutation } from "@/mutations/user";
import { rose600 } from "@/constants/theme";

export const ProfileGeneral = withForm({
  ...profileFormOpts,
  props: {
    flag: undefined as string | undefined,
  },
  render: ({ form, flag }) => {
    const usernameExistsMutation = useUsernameExistsMutation();

    return (
      <View>
        <form.AppField
          name="general.username"
          validators={{
            onChangeAsyncDebounceMs: 350,
            onChangeAsync: async ({ value }) => {
              const { exists } = await usernameExistsMutation.mutateAsync({
                username: value,
              });

              return exists ? "Username already exists" : undefined;
            },
          }}
          children={(field) => (
            <field.Input
              icon={<Hash size={18} />}
              placeholder="Username"
              rightIcon={
                <>
                  {!usernameExistsMutation.isPending &&
                  field.state.meta.errors[0] ? (
                    <SealWarning size={18} color={rose600} weight="bold" />
                  ) : null}
                  {usernameExistsMutation.isPending ? (
                    <Text fontSize="sm">checking...</Text>
                  ) : null}
                </>
              }
            />
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
