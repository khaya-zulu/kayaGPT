import { useState } from "react";
import { Image, View } from "react-native";

import type { NewWorkspaceToolOutput } from "@kgpt/ai/tools";

import { Rounded } from "@/components/rounded";
import { Button } from "@/components/button";

import { useUserSettings } from "@/hooks/use-user-settings";
import { useUseWorkspaceMutation } from "@/mutations/user";
import { Circle, CursorClick } from "phosphor-react-native";
import { Text } from "@/components/text";
import { zinc100, zinc200, zinc300 } from "@/constants/theme";
import { ColorPalette } from "../color-palette";

export const NewWorkspaceTool = ({ workspaceKey }: NewWorkspaceToolOutput) => {
  const [color, setColor] = useState<string | undefined>();
  const [isLoaded, setIsLoaded] = useState(false);

  const userSettings = useUserSettings();

  const useWorkspaceMutation = useUseWorkspaceMutation({
    onSuccess: async () => {
      userSettings.invalidateImage("workspace");
    },
  });

  const workspaceUrl = `${process.env.EXPO_PUBLIC_API_URL}/img/workspace/${workspaceKey}`;

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
          <Button
            variant="filled"
            onPress={() => {
              if (!color) return;

              useWorkspaceMutation.mutate({
                key: workspaceKey,
                color,
              });
            }}
            padding={{ horizontal: 10, vertical: 2.5 }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
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
          </Button>
        </View>
      </View>
    </Text>
  );
};
