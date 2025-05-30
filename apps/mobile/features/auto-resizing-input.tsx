import { useRef, useState } from "react";
import {
  Platform,
  TextInputProps,
  TouchableOpacity,
  type TextInput as RNTextInput,
} from "react-native";

import { TextInput } from "@/components/text-input";

import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

// credit: https://github.com/rs-4/expo-auto-resizing-input/blob/main/components/AutoResizingInput.tsx
export const AutoResizingInput = ({
  onSend,
  placeholder,
  defaultHeight = 18,
  value,
  onChange,
}: {
  onSend?: () => void;
  placeholder?: string;
  defaultHeight?: number;
  value: string;
  onChange: TextInputProps["onChange"];
}) => {
  const [inputHeight, setInputHeight] = useState(defaultHeight);

  const inputRef = useRef<RNTextInput>(null);

  const animationProgress = useSharedValue(0);

  const handleSend = () => {
    if (value.trim()) {
      onSend?.();
      setInputHeight(defaultHeight);

      animationProgress.value = withSpring(1, { damping: 15 });
      setTimeout(() => {
        animationProgress.value = withSpring(0, { damping: 15 });
      }, 100);
    }
  };

  const handleTextChange: TextInputProps["onChange"] = (ev) => {
    const newText = ev.nativeEvent.text;
    onChange?.(ev);

    // Calculate height based on lines
    const lines = newText.split("\n");
    const lineCount = Math.max(1, lines.length);
    const newInputHeight = lineCount * defaultHeight;
    setInputHeight(newInputHeight);
  };

  const handleKeyPress = (e: any) => {
    if (
      Platform.OS === "web" &&
      e.nativeEvent.key === "Enter" &&
      !e.nativeEvent.shiftKey
    ) {
      e.preventDefault();
      handleSend();
    }
  };

  // Simple animated styles - only animate scale, not height to avoid conflict with KeyboardAvoidingView
  const animatedContainerStyle = useAnimatedStyle(() => {
    const scale = interpolate(animationProgress.value, [0, 1], [1, 0.95]);
    return {
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[animatedContainerStyle, { height: inputHeight }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
      >
        <TextInput
          ref={inputRef}
          value={value}
          onChange={handleTextChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          multiline
          textAlignVertical="top"
          style={{
            lineHeight: defaultHeight,
            height: inputHeight + 15,
            ...(Platform.OS === "android" && {
              marginTop: 4,
            }),
            // Remove focus outline/border
            ...(Platform.OS === "web" && {
              outline: "none",
              border: "none",
            }),
          }}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};
