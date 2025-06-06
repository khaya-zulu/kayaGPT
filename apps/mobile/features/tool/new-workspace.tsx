import { useState } from "react";
import { Image, View } from "react-native";

import { Rounded } from "@/components/rounded";
import { Pill } from "@/components/pill";

import { useUserSettings } from "@/hooks/use-user-settings";
import { useUseWorkspaceMutation } from "@/mutations/user";
import { Circle, CursorClick } from "phosphor-react-native";
import { Text } from "@/components/text";
import { zinc100, zinc200, zinc300 } from "@/constants/theme";
import { ColorPalette } from "../color-palette";
import { processEnv } from "@/utils/env";

export const NewWorkspaceTool = ({
  workspaceKey,
  prompt,
}: {
  workspaceKey: string;
  prompt: string;
}) => {
  const [color, setColor] = useState<string | undefined>();
  const [isLoaded, setIsLoaded] = useState(false);

  const userSettings = useUserSettings();

  const useWorkspaceMutation = useUseWorkspaceMutation({
    onSuccess: async () => {
      userSettings.invalidateImage("workspace");
      await userSettings.invalidate();
    },
  });

  const workspaceUrl = `${processEnv.EXPO_PUBLIC_API_URL}/api/workspace/${workspaceKey}`;

  return (
    <Text style={{ marginTop: 10 }}>
      <View>
        <Text>
          <Rounded
            size="2xl"
            style={{
              padding: 5,
              backgroundColor: "#ffffff",
            }}
          >
            <Rounded size={13} style={{ overflow: "hidden" }}>
              <Image
                source={{
                  uri: workspaceUrl,
                }}
                onLoad={() => {
                  setIsLoaded(true);
                }}
                style={{
                  height: 125,
                  width: 125,
                  borderWidth: 1,
                  borderColor: zinc300,
                }}
              />
            </Rounded>
          </Rounded>
        </Text>
        {isLoaded ? (
          <ColorPalette src={workspaceUrl} onSelected={setColor} />
        ) : null}
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Pill
            variant="filled"
            noText
            onPress={() => {
              if (!color) return;

              useWorkspaceMutation.mutate({
                key: workspaceKey,
                color,
              });
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingVertical: 2.5,
                paddingHorizontal: 10,
              }}
            >
              {color ? (
                <>
                  {useWorkspaceMutation.isPending ? (
                    <Text style={{ color: "#fff" }}>...</Text>
                  ) : (
                    <>
                      <CursorClick size={14} color="#fff" />
                      <Text style={{ color: "#fff" }} fontSize="sm">
                        Use as workspace
                      </Text>
                    </>
                  )}
                </>
              ) : null}
              {!color ? (
                <>
                  <View style={{ flexDirection: "row" }}>
                    <Circle color={zinc300} weight="fill" />
                    <Circle
                      color={zinc200}
                      style={{ marginLeft: -15 }}
                      weight="fill"
                    />
                    <Circle
                      color={zinc100}
                      style={{ marginLeft: -15 }}
                      weight="fill"
                    />
                  </View>
                  <Text style={{ color: "#fff" }} fontSize="sm">
                    Pick a color
                  </Text>
                </>
              ) : null}
            </View>
          </Pill>
        </View>
      </View>
    </Text>
  );
};
