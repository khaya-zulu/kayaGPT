import { Link, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  ClockCounterClockwise,
  LinkSimple,
  Microphone,
  Trash,
} from "phosphor-react-native";
import { Pressable, View } from "react-native";
import { ToggleActionsVisibility } from "./toggle-actions-visibility";
import { zinc600 } from "@/constants/theme";

import { MessageTags } from "../message-tags";
import { useChatTitleQuery } from "@/queries/chat";
import { Text } from "@/components/text";

export const BackToolbar = ({
  isTitleEnabled,
}: {
  isTitleEnabled?: boolean;
}) => {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();

  const titleQuery = useChatTitleQuery(chatId, { isEnabled: isTitleEnabled });

  return (
    <Link href="/">
      <View style={{ flexDirection: "row", gap: 15, alignItems: "center" }}>
        <ArrowLeft weight="bold" size={14} />
        <Text>{titleQuery.data?.chat.title}</Text>
      </View>
    </Link>
  );
};

export const ChatBoxToolbar = ({
  isTitleEnabled,
  onChatDelete,
}: {
  isTitleEnabled?: boolean;
  onChatDelete?: () => void;
}) => {
  const { chatId } = useLocalSearchParams();

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {chatId ? <BackToolbar isTitleEnabled={isTitleEnabled} /> : null}
        {!chatId ? <MessageTags /> : null}

        <View style={{ flexDirection: "row", gap: 15, alignItems: "center" }}>
          {chatId ? (
            <Pressable onPress={onChatDelete}>
              <Trash size={18} weight="bold" color={"#e11d48"} />
            </Pressable>
          ) : null}

          {/* <LinkSimple size={17} weight="bold" color={zinc600} />
          <ClockCounterClockwise size={17} weight="bold" color={zinc600} />
          <Microphone size={19} weight="fill" /> */}
        </View>
      </View>
    </>
  );
};
