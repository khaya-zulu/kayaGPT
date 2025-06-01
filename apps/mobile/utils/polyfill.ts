import { isWeb } from "@/constants/platform";
// @ts-expect-error
import structuredClone from "@ungap/structured-clone";

if (!isWeb) {
  const setupPolyfills = async () => {
    const { polyfillGlobal } = await import(
      // @ts-ignore
      "react-native/Libraries/Utilities/PolyfillFunctions"
    );

    if (!("structuredClone" in globalThis)) {
      polyfillGlobal("structuredClone", () => structuredClone);
    }

    polyfillGlobal("TextEncoderStream", () => TextEncoderStream);
    polyfillGlobal("TextDecoderStream", () => TextDecoderStream);
  };

  setupPolyfills();
}

export {};
