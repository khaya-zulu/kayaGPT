import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Text } from "react-native";

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
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
