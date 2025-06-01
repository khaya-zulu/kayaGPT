import "@/utils/polyfill";

import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import "react-native-reanimated";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Text } from "react-native";

import { ClerkProvider } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { tokenCache } from "@clerk/clerk-expo/token-cache";

import { UserSettingsProvider } from "@/hooks/use-user-settings";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [isFontLoaded, error] = useFonts({
    "SpaceGrotesk-Medium": require("../assets/fonts/SpaceGrotesk-Medium.ttf"),
  });

  useEffect(() => {
    if (isFontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isFontLoaded]);

  if (!isFontLoaded && !error) {
    return <Text>Loading...</Text>;
  }

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <UserSettingsProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </UserSettingsProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
