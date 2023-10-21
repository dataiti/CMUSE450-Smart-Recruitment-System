import { formatDistanceToNow, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import numeral from "numeral";

export const numberWithCommas = (num) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const covertToDate = (dateString) => {
  const date = new Date(Date.parse(dateString));
  const formattedDate = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;

  return formattedDate;
};

export const timeAgo = (date) => {
  return formatDistanceToNow(date, { addSuffix: true, locale: vi });
};

export const formattedAmount = (amount) => {
  if (amount > 900000) return numeral(amount / 1000000).format("0") + " Triệu";
  else if (amount < 1000000 && amount > 99000) {
    return numeral(amount / 100).format("0") + " Trăm";
  } else return numeral(amount).format("0.0");
};

export const formatRemainingTime = (deadline) => {
  if (!deadline) return "Không có hạn cuối";

  if (!isValidDate(deadline)) return "Hạn cuối không hợp lệ";

  const currentDate = new Date();
  const targetDate = parseISO(deadline);
  const differenceInMilliseconds = targetDate - currentDate;

  if (differenceInMilliseconds <= 0) return "Hết hạn";

  const remainingTime = formatDistanceToNow(targetDate, {
    addSuffix: true,
    locale: vi,
  });

  return remainingTime;
};

function isValidDate(dateString) {
  const date = parseISO(dateString);
  return !isNaN(date.getTime());
}

export const formattedProvinceNames = (inputString) => {
  const modifiedString = inputString?.replace(/(Tỉnh|Thành phố)\s/g, "");

  return modifiedString;
};
