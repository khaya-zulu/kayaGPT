import { fontSpaceGrotesk, zinc600 } from "@/constants/theme";
import { TextInputProps, TextInput as NativeTextInput } from "react-native";

export const TextInput = ({ ...props }: TextInputProps) => {
  return (
    <NativeTextInput
      {...props}
      placeholderTextColor={zinc600}
      style={[{ fontFamily: fontSpaceGrotesk, outline: "none" }, props.style]}
    />
  );
};
