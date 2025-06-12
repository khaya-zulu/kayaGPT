import { isWeb } from "@/constants/platform";
import { useWindowDimensions } from "react-native";

export const useMobile = (props?: { width?: number }) => {
  const defaultProps = {
    width: 768, // Default width for mobile view
    ...props,
  };

  const { width } = useWindowDimensions();

  if (!isWeb) {
    return { isMobile: true };
  }

  return {
    isMobile: width < defaultProps.width,
  };
};
