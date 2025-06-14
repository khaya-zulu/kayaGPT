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
import { useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react";

import { View } from "react-native";

import { Text } from "@/components/text";
import { Redirect, usePathname, useLocalSearchParams } from "expo-router";

import * as Crypto from "expo-crypto";
import { useAuth } from "@clerk/clerk-expo";

type UserContextType = {
  colorSettings: NonNullable<UserSettingsQueryOutput["colorSettings"]>;
  isLoading: boolean;
  userId?: string;
  invalidateImage: (type: "workspace" | "avatar") => void;
  isOnboardingComplete: boolean;
  username?: string;
  ms: { workspace?: number; avatar?: number };
};

const UserSettingsContext = createContext<UserContextType>(null as any);

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();

  const { data, isLoading, isPending } = useUserSettingsQuery({
    enabled: isSignedIn,
  });

  const [ms, setMs] = useState<{ workspace?: number; avatar?: number }>({});

  const isOnboardingComplete = !!data?.onboardedAt;

  const pathname = usePathname();

  //#region image URLs
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

  if (!isLoaded || (isSignedIn && isPending)) {
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
        ms,
        userId: data?.id,
        username: data?.username,
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
  const params = useLocalSearchParams<{ username: string }>();

  const query = useQueryClient();

  const username = params.username || context.username;

  const ms = context.ms;

  const workspaceUrl = `${process.env.EXPO_PUBLIC_API_URL}/img/workspace/${username}${ms.workspace ? `?ms=${ms.workspace}` : ""}`;
  const avatarUrl = `${process.env.EXPO_PUBLIC_API_URL}/img/avatar/${username}${ms.avatar ? `?ms=${ms.avatar}` : ""}`;

  return {
    ...context,
    workspaceUrl,
    avatarUrl,
    invalidate: () =>
      query.invalidateQueries({ queryKey: userSettingsQueryKey }),
  };
};
