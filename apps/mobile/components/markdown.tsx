import { fontSpaceGrotesk } from "@/constants/theme";
import { ReactNode } from "react";
import { Image } from "react-native";
import MarkdownDisplay, { MarkdownProps } from "react-native-markdown-display";

export const Markdown = ({
  ...props
}: MarkdownProps & { children: ReactNode }) => {
  return (
    <MarkdownDisplay
      {...props}
      style={{
        body: { fontFamily: fontSpaceGrotesk, fontSize: 16 },
      }}
      rules={{
        image: (node, children, parent, style) => {
          return (
            <Image
              source={{ uri: node.attributes.src }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 15,
                ...style,
              }}
            />
          );
        },
      }}
    />
  );
};
