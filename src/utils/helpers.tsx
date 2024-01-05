export const getDaysAgo = (timeframe?: string): number => {
  switch (timeframe) {
    case "1M":
      return 30;
    case "3M":
      return 90;
    case "6M":
      return 180;
    case "1Y":
      return 365;
    case "3Y":
      return 1095;
    case "5Y":
      return 1825;
    default:
      return 30;
  }
};

export const getDateDaysAgo = (days: number): string => {
  const today = new Date();
  today.setDate(today.getDate() - days);

  const year = today.getFullYear();
  const month = today.getMonth() + 1; // Month is zero-based, add 1 to get the correct month
  const day = today.getDate();

  // Pad the month and day with a leading zero if they are less than 10
  const formattedMonth = month < 10 ? `0${month}` : month.toString();
  const formattedDay = day < 10 ? `0${day}` : day.toString();

  return `${year}-${formattedMonth}-${formattedDay}`;
};

export const getCurrentDateFormatted = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // Month is zero-based, add 1 to get the correct month
  const day = now.getDate();

  // Pad the month and day with a leading zero if they are less than 10
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;

  return `${year}-${formattedMonth}-${formattedDay}`;
};

export const formatToPercentage = (value: number): string => {
  const percentage = (value * 100).toFixed(2);
  return `${percentage}%`;
};

export const formatUSD = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    // You can add more options as needed
  }).format(amount);
};
