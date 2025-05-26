import { StyleProp, TextStyle, View } from "react-native";

import { Text } from "@/components/text";

import { zinc700 } from "@/constants/theme";
import { ChatCircleDots } from "phosphor-react-native";
import { Rounded } from "@/components/rounded";
import { Link } from "expo-router";
import { ChatHistoryQueryOutput } from "@/queries/chat";
import { formatRelative } from "@/utils/date";
import { useUserSettings } from "@/hooks/use-user-settings";
import { isWeb } from "@/constants/platform";

export const ChatSummary = ({
  style,
  title,
  message,
  chatId,
}: {
  style?: StyleProp<TextStyle>;
  title?: string;
  chatId?: string;
  message: ChatHistoryQueryOutput["chats"][number]["lastMessage"];
}) => {
  const { colorSettings } = useUserSettings();

  const maxLength = isWeb ? 35 : 25;

  const isTrailing = (title ?? "").length > maxLength;

  return (
    <Link href={`/chat/${chatId}`} style={style}>
      <Rounded
        style={{
          overflow: "hidden",
          width: "100%",
        }}
      >
        <View
          style={{
            backgroundColor: "#ffffff" + "b3",
          }}
        >
          <View style={{ padding: 10 }}>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                padding: 10,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <ChatCircleDots size={18} weight="bold" />
                <Text fontSize="sm">
                  {title?.slice(0, maxLength)}
                  {isTrailing ? "..." : null}
                </Text>
              </View>

              <Text fontSize="sm" style={{ color: colorSettings["900"] }}>
                {message?.createdAt
                  ? formatRelative(new Date(message?.createdAt))
                  : "-"}
              </Text>
            </View>

            <View style={{ paddingHorizontal: 10, paddingBottom: 5 }}>
              <Text
                fontSize="sm"
                style={{ color: colorSettings[900] }}
                numberOfLines={1}
              >
                AI:{" "}
                <Text style={{ color: zinc700 }}>
                  {message?.content ?? "-"}
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </Rounded>
    </Link>
  );
};
