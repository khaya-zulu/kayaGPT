import { zinc200, zinc300 } from "@/constants/theme";
import { Rounded } from "./rounded";
import { Text } from "./text";
import { ReactNode } from "react";
import { TextProps } from "react-native";

export const Pill = ({
  children,
  style,
  noText,
}: {
  children: ReactNode;
  style?: TextProps["style"];
  noText?: boolean;
}) => {
  return (
    <Rounded
      size="lg"
      style={{
        paddingHorizontal: 10,
        backgroundColor: zinc200 + "4d",
        borderWidth: 1,
        borderColor: zinc300 + "e6",
      }}
    >
      {noText ? children : <Text style={style}>{children}</Text>}
    </Rounded>
  );
};
