export const numberWithCommas = (num) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const covertToDate = (dateString) => {
  const date = new Date(Date.parse(dateString));
  const formattedDate = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;

  return formattedDate;
};
