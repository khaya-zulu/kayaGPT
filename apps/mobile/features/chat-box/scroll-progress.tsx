import { View } from "react-native";
import { Circle } from "phosphor-react-native";

import { useUserSettings } from "@/hooks/use-user-settings";

import { AnimatedCircularProgress } from "react-native-circular-progress";

export const ScrollProgress = ({ progress }: { progress: number }) => {
  const { colorSettings } = useUserSettings();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <AnimatedCircularProgress
        tintColor={colorSettings["800"]}
        size={20}
        width={2}
        fill={progress}
        backgroundColor={colorSettings["200"]}
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        {() => <Circle size={16} color={colorSettings["200"]} weight="fill" />}
      </AnimatedCircularProgress>
    </View>
  );
};
