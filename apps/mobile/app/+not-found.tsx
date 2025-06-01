import { usePathname } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  const pathname = usePathname();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{pathname}</Text>
    </View>
  );
}
