import { Text } from "@/components/text";
import { DateTime } from "luxon";

export const DateNow = () => {
  return <Text fontSize="sm">{DateTime.now().toFormat("ccc LL LLL t a")}</Text>;
};
