import { Button } from "@/components/button";
import { Text } from "@/components/text";
import { rose600 } from "@/constants/theme";
import { useChatDeleteMutation } from "@/mutations/chat";
import { chatHistoryQueryKey } from "@/queries/chat";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Trash } from "phosphor-react-native";
import { View } from "react-native";

export const CompleteOnboardingTool = ({ username }: { username: string }) => {
  const utils = useQueryClient();

  const deleteChatMutation = useChatDeleteMutation({
    onSuccess: () => {
      return utils.invalidateQueries({ queryKey: chatHistoryQueryKey });
    },
  });

  const params = useLocalSearchParams<{ chatId: string }>();

  const handleDeleteChat = () => {
    deleteChatMutation.mutate({
      chatId: params.chatId,
    });
  };

  return (
    <View style={{ flexDirection: "column", gap: 10 }}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Link href={`/space/${username}`}>
          <Button variant="filled" padding={{ horizontal: 10 }}>
            <Text style={{ color: "#fff" }}>View space ({username})</Text>
          </Button>
        </Link>
      </View>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Button onPress={handleDeleteChat}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {!deleteChatMutation.isPending ? (
              <>
                <Text>Delete Chat</Text>
                <Trash color={rose600} size={18} weight="bold" />
              </>
            ) : (
              <Text>...</Text>
            )}
          </View>
        </Button>
      </View>
    </View>
  );
};
