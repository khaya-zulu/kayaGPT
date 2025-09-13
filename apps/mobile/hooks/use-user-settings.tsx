import {
  fontSpaceGrotesk,
  sky600,
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

import { CubeLoader, WorkspaceLoader } from "@/features/workspace-loader";

import {
  Redirect,
  usePathname,
  useLocalSearchParams,
  Link,
  useSegments,
} from "expo-router";
import * as Crypto from "expo-crypto";
import { useAuth } from "@clerk/clerk-expo";
import { View } from "react-native";
import { Text } from "@/components/text";

type AnimatedDoneState = {
  index: boolean;
};

type UserContextType = {
  colorSettings: NonNullable<UserSettingsQueryOutput["colorSettings"]>;
  isLoading: boolean;
  userId?: string;
  /**
   * method to invalidate the cached workspace or avatar image
   */
  invalidateImage: (type: "workspace" | "avatar") => void;
  isOnboardingComplete: boolean;
  username?: string;
  /**
   * the client caches the workspace and avatar images
   * so we need to invalidate them when they change
   */
  ms: { workspace?: number; avatar?: number };
  /**
   * we want to track if animation has already run for a page
   * so that we can skip it on subsequent visits
   * */
  isAnimatedDoneState: AnimatedDoneState;
  /**
   * marks an animation as complete.
   */
  completeAnimation: (type: keyof AnimatedDoneState) => void;
};

const UserSettingsContext = createContext<UserContextType>(null as any);

const useWorkspaceUrl = ({
  contextUsername,
  ms,
}: {
  contextUsername: string;
  ms?: number;
}) => {
  const params = useLocalSearchParams<{ username: string }>();

  const username = params.username || contextUsername;
  const workspaceUrl = `${process.env.EXPO_PUBLIC_API_URL}/img/workspace/${username}${ms ? `?ms=${ms}` : ""}`;

  return { workspaceUrl, username };
};

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();

  const { data, isLoading, isPending, isSuccess } = useUserSettingsQuery({
    enabled: isSignedIn,
  });

  const [ms, setMs] = useState<{ workspace?: number; avatar?: number }>({});
  const [isWorkspaceImageLoading, setIsWorkspaceImageLoading] = useState(true);

  //#region animated done state
  const [isAnimatedDoneState, setIsAnimatedDoneState] = useState<
    UserContextType["isAnimatedDoneState"]
  >({
    index: false,
  });

  const completeAnimation = (type: keyof AnimatedDoneState) => {
    setIsAnimatedDoneState((prev) => ({
      ...prev,
      [type]: true,
    }));
  };
  //#endregion

  const { workspaceUrl } = useWorkspaceUrl({
    contextUsername: data?.username ?? "",
    ms: undefined,
  });

  const isOnboardingComplete = !!data?.onboardedAt;

  const pathname = usePathname();
  const segments = useSegments();
  const { username } = useLocalSearchParams<{ username: string }>();

  //#region image URLs
  const handleInvalidateImage = (type: "workspace" | "avatar") => {
    setMs((prev) => ({ ...prev, [type]: Date.now() }));
  };
  //#endregion

  //#region color settings
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

  const colorSettings = {
    ...getDefaultColors(),
    ...(data?.colorSettings || {}),
  };
  //#endregion

  const isUserPage =
    pathname === `/${username}` || pathname.includes("?username");

  if (isSuccess && !data.isAllowed && !isUserPage) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          flexDirection: "column",
          gap: 10,
          maxWidth: 450,
          margin: "auto",
          padding: 10,
        }}
      >
        <CubeLoader color={zinc500} />
        <Text style={{ marginTop: 10 }}>
          Thank's for showing an interest ⛅️
        </Text>
        <Text>
          Right now, I’m building this for myself and a few friends, but I’ll be
          opening it up soon. In the meantime, I’ll be sharing updates on{" "}
          <Link
            href="https://x.com/khaya_was_taken"
            target="_blank"
            rel="noreferrer noopener"
            style={{
              fontFamily: fontSpaceGrotesk,
              fontSize: 16,
              textDecorationLine: "underline",
              color: sky600,
            }}
          >
            Twitter
          </Link>
          .
        </Text>
      </View>
    );
  }

  if (
    // auth is not loaded yet
    !isLoaded ||
    // user is not signed in
    (isSignedIn && isPending) ||
    // workspace image is loading
    (!!data?.onboardedAt && isSignedIn && isWorkspaceImageLoading)
  ) {
    return (
      <WorkspaceLoader
        color={colorSettings["base"]}
        isAuthLoading={!isLoaded}
        isSignedIn={isSignedIn}
        onWorkspaceUrlLoaded={() => setIsWorkspaceImageLoading(false)}
        workspaceUrl={isPending ? undefined : workspaceUrl}
      />
    );
  }

  // there is an existing chat, returned by the server
  const isOnboardingInProgress = !!data?.firstChatId;

  return (
    <UserSettingsContext.Provider
      value={{
        colorSettings: colorSettings,
        isLoading,
        ms,
        userId: data?.id,
        username: data?.username,
        invalidateImage: handleInvalidateImage,
        isOnboardingComplete,
        completeAnimation,
        isAnimatedDoneState,
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
  const ms = context.ms;

  const { workspaceUrl, username } = useWorkspaceUrl({
    contextUsername: context.username ?? "",
    ms: context.ms.workspace,
  });

  const avatarUrl = `${process.env.EXPO_PUBLIC_API_URL}/img/avatar/${username}${ms.avatar ? `?ms=${ms.avatar}` : ""}`;

  return {
    ...context,
    workspaceUrl,
    avatarUrl,
    invalidate: () =>
      query.invalidateQueries({ queryKey: userSettingsQueryKey }),
  };
};
