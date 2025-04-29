import { Rounded } from "@/components/rounded";
import { Text } from "@/components/text";
import { isWeb } from "@/constants/platform";
import { sky200, sky800, zinc100, zinc200, zinc300 } from "@/constants/theme";
import { MagnifyingGlass } from "phosphor-react-native";
import { Pressable, View } from "react-native";

export const MessageTags = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 4,
        paddingHorizontal: 1,
        alignItems: "center",
      }}
    >
      {isWeb ? (
        <Pressable style={{ marginRight: 10 }}>
          <MagnifyingGlass size={16} weight="bold" />
        </Pressable>
      ) : null}
      <Rounded
        size="lg"
        style={{ paddingHorizontal: 10, backgroundColor: sky200 + "4d" }}
      >
        <Text fontSize="sm" style={{ color: sky800, fontWeight: "bold" }}>
          All
        </Text>
      </Rounded>
      <Rounded
        size="lg"
        style={{
          paddingHorizontal: 10,
          backgroundColor: zinc200 + "4d",
          flexDirection: "row",
          gap: 12,
          borderWidth: 1,
          borderColor: zinc300 + "e6",
        }}
      >
        <Text>Scheduled</Text>
        <Text>10</Text>
      </Rounded>
      <Rounded
        size="lg"
        style={{
          paddingHorizontal: 10,
          backgroundColor: zinc200 + "4d",
          borderWidth: 1,
          borderColor: zinc300 + "e6",
        }}
      >
        <Text>Pinned</Text>
      </Rounded>

      {!isWeb ? (
        <Pressable style={{ marginLeft: "auto" }}>
          <MagnifyingGlass size={16} weight="bold" />
        </Pressable>
      ) : null}
    </View>
  );
};
