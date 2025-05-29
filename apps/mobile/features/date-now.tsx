import { Text } from "@/components/text";
import { DateTime } from "luxon";

export const DateNow = () => {
  return (
    <Text fontSize="sm">
      {DateTime.fromJSDate(new Date()).toFormat("ccc L LLL t a")}
    </Text>
  );
};
