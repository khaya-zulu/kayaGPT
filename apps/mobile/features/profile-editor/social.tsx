import { View } from "react-native";

import { GithubLogo, Globe, LinkedinLogo, XLogo } from "phosphor-react-native";
import { ReactNode } from "react";
import { profileFormOpts, withForm } from "./form";

export const ProfileSocial = withForm({
  ...profileFormOpts,
  render: ({ form }) => {
    return (
      <View>
        <form.AppField
          name="social.github"
          children={(field) => (
            <field.Input icon={<GithubLogo size={18} />} placeholder="Github" />
          )}
        />
        <form.AppField
          name="social.x"
          children={(field) => (
            <field.Input icon={<XLogo size={18} />} placeholder="X (Twitter)" />
          )}
        />
        <form.AppField
          name="social.linkedin"
          children={(field) => (
            <field.Input
              icon={<LinkedinLogo size={18} />}
              placeholder="Linkedin"
            />
          )}
        />
        <form.AppField
          name="social.website"
          children={(field) => (
            <field.Input
              icon={<Globe size={18} />}
              placeholder="Personal Website"
            />
          )}
        />
      </View>
    );
  },
});
