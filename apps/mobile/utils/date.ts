import { DateTime } from "luxon";

export const formatRelative = (date: Date) => {
  return DateTime.fromISO(date.toISOString()).toRelative();
};
