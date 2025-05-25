import { ReactNode } from "react";
import { Rounded } from "../components/rounded";
import { View, ViewProps } from "react-native";
import { useUserSettings } from "@/hooks/use-user-settings";
import { zinc600 } from "@/constants/theme";

export const Card = ({
  header,
  children,
  style,
}: {
  header?: ReactNode;
  children: ReactNode;
  style?: ViewProps["style"];
}) => {
  const userSettings = useUserSettings();

  return (
    <Rounded
      size={19}
      style={{
        padding: 4,
        backgroundColor: "#fff",
        width: "80%",
        marginTop: 10,
      }}
    >
      <Rounded
        style={[
          {
            backgroundColor: "#ffffff",
            shadowOffset: {
              width: 0.2,
              height: 0.2,
            },
            shadowOpacity: 0.3,
            shadowRadius: 1,
            shadowColor: zinc600,
          },
          style,
        ]}
      >
        {header ? (
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: userSettings.colorSettings[100] + "80",
              paddingHorizontal: 10,
              paddingVertical: 8,
            }}
          >
            {header}
          </View>
        ) : null}
        <View style={{ paddingHorizontal: 10, paddingVertical: 8 }}>
          {children}
        </View>
      </Rounded>
    </Rounded>
  );
};
