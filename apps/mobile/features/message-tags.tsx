import { Button } from "@/components/button";
import { Text } from "@/components/text";
import { useMobile } from "@/hooks/use-mobile";
import { MagnifyingGlass } from "phosphor-react-native";
import { Pressable, View } from "react-native";

export const MessageTags = () => {
  const { isMobile } = useMobile();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 4,
        alignItems: "center",
      }}
    >
      {!isMobile ? (
        <Pressable style={{ marginRight: 10 }}>
          <MagnifyingGlass size={16} weight="bold" />
        </Pressable>
      ) : null}

      <Button variant="primary">All</Button>
      <Button>
        <Text>Scheduled</Text>
        <Text style={{ marginLeft: 10 }}>10</Text>
      </Button>
      <Button>Pinned</Button>

      {isMobile ? (
        <Pressable style={{ marginLeft: "auto" }}>
          <MagnifyingGlass size={16} weight="bold" />
        </Pressable>
      ) : null}
    </View>
  );
};
