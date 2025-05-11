import { fontSpaceGrotesk, zinc600 } from "@/constants/theme";
import { TextInputProps } from "react-native";

export const TextInput = ({ ...props }: TextInputProps) => {
  return (
    <TextInput
      {...props}
      placeholderTextColor={zinc600}
      style={[{ fontFamily: fontSpaceGrotesk, outline: "none" }, props.style]}
    />
  );
};
