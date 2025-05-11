import { useEffect, useState } from "react";

/**
 * This function only looks complex :)
 *
 * It allows you to perform an action based on the
 * previous and current value of a variable, whenever it changes.
 *
 * The action can be performed during render
 * (please see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes),
 * which is important and preferred, to avoid state desync,
 * or in a useEffect, if it contains side-effects.
 *
 * @param value the value to be watched
 * @param onChange the action to be performed during render
 * @param onChangeEffect the action to be performed in an effect
 */
export const useWatch = <T>(
  value: T,
  onChange?: ((prev: T | undefined, cur: T) => void) | undefined,
  onChangeEffect?:
    | ((prev: T | undefined, cur: T) => void | (() => void))
    | undefined
) => {
  const [prevValue, setPrevValue] = useState<T | undefined>(undefined);
  const [effectCb, setEffectCb] = useState<
    (() => void | (() => void)) | undefined
  >(undefined);

  if (prevValue !== value) {
    const prev = prevValue;
    const cur = value;
    setPrevValue(value);

    if (onChange) {
      onChange(prev, cur);
    }
    if (onChangeEffect) {
      setEffectCb(() => () => onChangeEffect(prev, cur));
    }
  }

  useEffect(() => {
    return effectCb?.();
  }, [prevValue]);
};
