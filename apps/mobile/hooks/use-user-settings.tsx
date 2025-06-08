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
import { Redirect, usePathname } from "expo-router";

import * as Crypto from "expo-crypto";
import { useAuth } from "@clerk/clerk-expo";

type UserContextType = {
  colorSettings: NonNullable<UserSettingsQueryOutput["colorSettings"]>;
  isLoading: boolean;
  userId?: string;
  invalidateImage: (type: "workspace" | "avatar") => void;
  workspaceUrl: string;
  avatarUrl: string;
  isOnboardingComplete: boolean;
  username?: string;
};

const UserSettingsContext = createContext<UserContextType>(null as any);

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isPending } = useUserSettingsQuery();
  const [ms, setMs] = useState<{ workspace?: number; avatar?: number }>({});

  const { isSignedIn } = useAuth();

  const isOnboardingComplete = !!data?.onboardedAt;

  const pathname = usePathname();

  //#region image URLs
  const workspaceUrl = `${processEnv.EXPO_PUBLIC_API_URL}/api/workspace/${data?.id}${ms.workspace ? `?ms=${ms.workspace}` : ""}`;
  const avatarUrl = `${processEnv.EXPO_PUBLIC_API_URL}/api/user/profile/avatar/${data?.id}${ms.avatar ? `?ms=${ms.avatar}` : ""}`;

  const handleInvalidateImage = (type: "workspace" | "avatar") => {
    setMs((prev) => ({ ...prev, [type]: Date.now() }));
  };
  //#endregion

  //#region color settings
  const colorSettings = data?.colorSettings;

  const getDefaultColors = () => {
    return {
      "50": zinc50,
      "100": zinc100,
      "200": zinc200,
      "300": zinc300,
      "400": zinc400,
      base: zinc500,
      "600": zinc500,
      "700": zinc600,
      "800": zinc800,
      "900": zinc900,
    };
  };
  //#endregion

  if (isPending) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Booting workspace...</Text>
      </View>
    );
  }

  // there is an existing chat, returned by the server
  const isOnboardingInProgress = !!data?.firstChatId;

  return (
    <UserSettingsContext.Provider
      value={{
        colorSettings: {
          ...getDefaultColors(),
          ...(colorSettings || {}),
        },
        isLoading,
        userId: data?.id,
        username: data?.username,
        workspaceUrl,
        avatarUrl,
        invalidateImage: handleInvalidateImage,
        isOnboardingComplete,
      }}
    >
      {children}
      {!isOnboardingComplete && !pathname.startsWith("/chat") && isSignedIn ? (
        <Redirect
          href={`/chat/${isOnboardingInProgress ? data.firstChatId : Crypto.randomUUID()}${isOnboardingInProgress ? "" : "?isOnboarding=true"}`}
        />
      ) : null}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);

  const query = useQueryClient();

  return {
    ...context,
    invalidate: () =>
      query.invalidateQueries({ queryKey: userSettingsQueryKey }),
  };
};
