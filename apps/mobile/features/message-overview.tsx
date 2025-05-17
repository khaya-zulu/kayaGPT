import { styled } from "styled-components/native";

import { StyleProp, TextStyle, View } from "react-native";

import { Text } from "@/components/text";

import { sky800, zinc600 } from "@/constants/theme";
import { ChatCircleDots } from "phosphor-react-native";
import { isWeb } from "@/constants/platform";
import { Rounded } from "@/components/rounded";
import { Link } from "expo-router";
import { BlurView } from "expo-blur";
import { ChatHistoryQueryOutput } from "@/queries/chat";
import { formatRelative } from "@/utils/date";
import { useUserSettings } from "@/hooks/use-user-settings";

const MessageOverviewBox = styled(Rounded)<{ borderColor?: string }>`
  border: 1px solid ${(props) => props.borderColor};
  overflow: hidden;
  width: 100%;
`;

export const MessageOverview = ({
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

  return (
    <Link href={`/chat/${chatId}`} style={style}>
      <MessageOverviewBox borderColor={colorSettings[50]}>
        <View
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "#fff",
            opacity: isWeb ? 0.5 : 0.2,
          }}
        />

        <BlurView
          intensity={20}
          style={{
            backgroundColor: "#ffffff" + "80",
            padding: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginBottom: 10,
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
              <Text fontSize="sm">{title}</Text>
            </View>

            <Text fontSize="sm" style={{ color: colorSettings["900"] }}>
              {message?.createdAt
                ? formatRelative(new Date(message?.createdAt))
                : "-"}
            </Text>
          </View>
          <Text fontSize="sm" numberOfLines={2}>
            AI:{" "}
            <Text style={{ color: zinc600 }}>{message?.content ?? "-"}</Text>
          </Text>
        </BlurView>
      </MessageOverviewBox>
    </Link>
  );
};
