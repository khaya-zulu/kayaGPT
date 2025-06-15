import { AnimatedText, Text } from "@/components/text";
import { zinc500 } from "@/constants/theme";
import { useUserSettings } from "@/hooks/use-user-settings";
import { Cube } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";
import {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const CubeLoader = ({ color }: { color: string }) => {
  const [state, setState] = useState(0);

  const states = [
    { rotateY: "0deg", rotateX: "0deg" },
    { rotateY: "180deg", rotateX: "0deg" },
    { rotateY: "180deg", rotateX: "180deg" },
    { rotateY: "0deg", rotateX: "180deg" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => (prev + 1) % states.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Cube
      size={18}
      weight="duotone"
      color={color}
      // flip x, todo: use for loading
      style={{
        transform: [
          { rotateY: states[state].rotateY },
          { rotateX: states[state].rotateX },
        ],
      }}
    />
  );
};

type TextState =
  | "checking auth"
  | "fetching workspace"
  | "loading background"
  | "redirecting to sign in";

export const WorkspaceLoader = ({
  color,
  isAuthLoading,
  onWorkspaceUrlLoaded,
  workspaceUrl,
  isSignedIn = false,
}: {
  color: string;
  isAuthLoading: boolean;
  onWorkspaceUrlLoaded?: () => void;
  workspaceUrl?: string;
  isSignedIn?: boolean;
}) => {
  //#region text ui state
  const [textIdx, setTextIdx] = useState(0);

  const postAuthCheckFlow: TextState = isSignedIn
    ? workspaceUrl
      ? "fetching workspace"
      : "loading background"
    : workspaceUrl
      ? "loading background"
      : "redirecting to sign in";

  const text: [string, TextState] = [
    "booting up",
    isAuthLoading ? "checking auth" : postAuthCheckFlow,
  ];
  // #endregion

  //#region animations
  const y = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: y.value }],
    };
  });

  const updateTextIdx = () => {
    setTextIdx((prev) => (prev === 0 ? 1 : 0));
  };

  useAnimatedReaction(
    () => {
      return y.value;
    },
    (currYValue) => {
      if (currYValue === 40) {
        runOnJS(updateTextIdx)();
      }
    }
  );

  useEffect(() => {
    y.value = withRepeat(
      withSequence(
        withDelay(150, withTiming(0, { duration: 500 })),
        withDelay(150, withTiming(40, { duration: 500 })),
        withDelay(0, withTiming(-40, { duration: 0 }))
      ),
      -1
    );
  }, []);
  //#endregion

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
      }}
    >
      <CubeLoader color={color} />
      <Text style={{ color: zinc500 }}>/</Text>
      <Text>
        <Text style={{ color: zinc500 }}>kaya</Text>GPT
      </Text>
      <Text>/</Text>
      <View style={{ width: 200, overflow: "hidden" }}>
        <AnimatedText style={animatedStyle}>{text[textIdx]}</AnimatedText>
      </View>
      {workspaceUrl ? (
        <Image
          aria-hidden
          source={{ uri: workspaceUrl }}
          style={{ position: "absolute", bottom: 0, right: 0 }}
          onLoad={onWorkspaceUrlLoaded}
        />
      ) : null}
    </View>
  );
};
