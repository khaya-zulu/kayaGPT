import { Dimensions } from "react-native";

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

import { ForwardedRef } from "react";
import { useSharedValue } from "react-native-reanimated";

import { ProfileEditor } from "./index";

const { height: screenHeight } = Dimensions.get("window");

export const ProfileEditorBottomSheet = ({
  ref,
  onClose,
}: {
  ref: ForwardedRef<BottomSheetModal<any>>;
  onClose: () => void;
}) => {
  const postion = useSharedValue(500);

  return (
    <BottomSheetModal ref={ref} animatedPosition={postion}>
      <BottomSheetView style={{ flex: 1, height: screenHeight - 200 }}>
        <ProfileEditor tab="general" onClose={onClose} />
      </BottomSheetView>
    </BottomSheetModal>
  );
};
