import { TextInput } from "@/components/text-input";
import { useUserSettings } from "@/hooks/use-user-settings";
import {
  createFormHookContexts,
  createFormHook,
  formOptions,
} from "@tanstack/react-form";
import { ReactNode } from "react";
import { TextInputProps, View } from "react-native";

export const profileFormOpts = formOptions({
  defaultValues: {
    social: {
      x: "",
      github: "",
      website: "",
      linkedin: "",
    },
    general: {
      username: "",
      displayName: "",
      regionName: "",
    },
  },
});

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

const Input = ({ icon, ...props }: { icon: ReactNode } & TextInputProps) => {
  const userSettings = useUserSettings();

  const field = useFieldContext<string>();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: userSettings.colorSettings[100] + "80",
      }}
    >
      {icon}
      <TextInput
        {...props}
        value={field.state.value}
        onChangeText={field.handleChange}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export const { useAppForm, withForm } = createFormHook({
  ...profileFormOpts,
  fieldContext,
  formContext,
  fieldComponents: {
    Input,
  },
  formComponents: {},
});
