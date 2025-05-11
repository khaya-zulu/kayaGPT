import { Rounded } from "@/components/rounded";
import { Text } from "@/components/text";
import { TextInput } from "@/components/text-input";
import { sky50 } from "@/constants/theme";
import { View } from "react-native";

export default function BioPage() {
  return (
    <View style={{ flexDirection: "column", gap: 10 }}>
      <Text style={{ marginLeft: 20 }}>Biograph (Public)?</Text>
      <Rounded
        style={{
          padding: 20,
          backgroundColor: "#ffffff",
          borderWidth: 2,
          borderColor: sky50,
        }}
      >
        <TextInput
          multiline
          numberOfLines={2}
          placeholder="Explain yourself in a few words (This is public)"
        />
      </Rounded>
    </View>
  );
}
