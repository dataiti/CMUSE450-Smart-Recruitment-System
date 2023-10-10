import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import numeral from "numeral";

export const timeAgo = (date) => {
  return formatDistanceToNow(date, { addSuffix: true, locale: vi });
};

export const formattedAmount = (amount) => {
  if (amount > 900000) return numeral(amount / 1000000).format("0") + " Triệu";
  else if (amount < 1000000 && amount > 99000) {
    return numeral(amount / 100).format("0") + " Trăm";
  } else return numeral(amount).format("0.0");
};

export const formattedProvinceNames = (inputString) => {
  const modifiedString = inputString.replace(/(Tỉnh|Thành phố)\s/g, "");

  return modifiedString;
};
