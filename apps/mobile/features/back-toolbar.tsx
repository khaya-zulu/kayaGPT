import { Text } from "@/components/text";
import { useChatTitleQuery } from "@/queries/chat";
import { Link, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "phosphor-react-native";
import { View } from "react-native";

export const BackToolbar = () => {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();

  const titleQuery = useChatTitleQuery(chatId);

  return (
    <Link href="/">
      <View style={{ flexDirection: "row", gap: 15, alignItems: "center" }}>
        <ArrowLeft weight="bold" size={14} />
        <Text>{titleQuery.data?.chat.title}</Text>
      </View>
    </Link>
  );
};
