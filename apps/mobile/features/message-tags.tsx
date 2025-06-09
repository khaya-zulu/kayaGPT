import { Pill } from "@/components/button";
import { Text } from "@/components/text";
import { isWeb } from "@/constants/platform";
import { MagnifyingGlass } from "phosphor-react-native";
import { Pressable, View } from "react-native";

export const MessageTags = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 4,
        alignItems: "center",
      }}
    >
      {isWeb ? (
        <Pressable style={{ marginRight: 10 }}>
          <MagnifyingGlass size={16} weight="bold" />
        </Pressable>
      ) : null}

      <Pill variant="primary">All</Pill>
      <Pill>
        <Text>Scheduled</Text>
        <Text style={{ marginLeft: 10 }}>10</Text>
      </Pill>
      <Pill>Pinned</Pill>

      {!isWeb ? (
        <Pressable style={{ marginLeft: "auto" }}>
          <MagnifyingGlass size={16} weight="bold" />
        </Pressable>
      ) : null}
    </View>
  );
};
