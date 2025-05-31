import {
  zinc100,
  zinc200,
  zinc300,
  zinc400,
  zinc50,
  zinc500,
  zinc600,
  zinc800,
  zinc900,
} from "@/constants/theme";
import {
  useUserSettingsQuery,
  type UserSettingsQueryOutput,
  userSettingsQueryKey,
} from "@/queries/users";
import { processEnv } from "@/utils/env";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react";

import { View } from "react-native";

import { Text } from "@/components/text";

type UserContextType = {
  colorSettings: NonNullable<UserSettingsQueryOutput["colorSettings"]>;
  isLoading: boolean;
  userId?: string;
  setMs: React.Dispatch<React.SetStateAction<number | undefined>>;
  ms?: number;
};

const UserSettingsContext = createContext<UserContextType>(null as any);

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isPending } = useUserSettingsQuery();
  const [ms, setMs] = useState<number>();

  const colorSettings = data?.colorSettings;

  if (isPending) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Booting workspace...</Text>
      </View>
    );
  }

  return (
    <UserSettingsContext.Provider
      value={{
        colorSettings: {
          "50": colorSettings?.[50] ?? zinc50,
          "100": colorSettings?.[100] ?? zinc100,
          "200": colorSettings?.[200] ?? zinc200,
          "300": colorSettings?.[300] ?? zinc300,
          "400": colorSettings?.[400] ?? zinc400,
          base: colorSettings?.["base"] ?? zinc500,
          "600": colorSettings?.[600] ?? zinc500,
          "700": colorSettings?.[700] ?? zinc600,
          "800": colorSettings?.[800] ?? zinc800,
          "900": colorSettings?.[900] ?? zinc900,
        },
        isLoading,
        userId: data?.id,
        ms,
        setMs,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);

  const ms = context.ms;

  const query = useQueryClient();

  return {
    ...context,
    workspaceUrl: `${processEnv.EXPO_PUBLIC_API_URL}/api/workspace/${context.userId}${ms ? `?ms=${ms}` : ""}`,
    avatarUrl: `${processEnv.EXPO_PUBLIC_API_URL}/api/user/profile/avatar/${context.userId}${ms ? `?ms=${ms}` : ""}`,
    invalidate: () =>
      query.invalidateQueries({ queryKey: userSettingsQueryKey }),
    invalidateMs: () => {
      context.setMs(Date.now());
    },
  };
};
