import { formatISO, isPast, isToday } from "date-fns";

export const serializeDate = (date) =>
  formatISO(date, { representation: "date" });

export const formatHumanReadable = (date) => {
  const formatter = new Intl.DateTimeFormat("en-us", {
    weekday: "long",
    month: "numeric",
    day: "numeric",
  });

  return formatter.format(date);
};

export const isPastDate = (date) => !isToday(date) && isPast(date);
