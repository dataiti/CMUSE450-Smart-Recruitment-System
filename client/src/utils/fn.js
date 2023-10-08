import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export const timeAgo = (date) => {
  return formatDistanceToNow(date, { addSuffix: true, locale: vi });
};
