import { formatISO, parseISO } from "date-fns";
import { sum, map, fromPairs, pipe, path } from "ramda";

export const formatISODate = (date) =>
  formatISO(date, { representation: "date" });

export const normalizeModels = pipe(
  map((model) => [model.id, model]),
  fromPairs
);

export const calculateTotalDifficulty = pipe(
  map(path(["difficulty", "value"])),
  sum
);

export const isToday = (date) => date === formatISODate(new Date());

export const formatDate = (date) => {
  const formatter = new Intl.DateTimeFormat("en-us", {
    weekday: "long",
    month: "numeric",
    day: "numeric",
  });

  return formatter.format(parseISO(date));
};

export const debounce = (func, duration) => {
  let timeout;

  return (...args) => {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, duration);
  };
};

export const titleCase = (str) => {
  if (str === "") return str;

  return str[0].toUpperCase() + str.slice(1).toLowerCase();
};

export const assert = (predicate, message) => {
  if (!predicate) throw new Error(message);
};

let counter = 0;
export const uniqueId = (prefix = "") => `${prefix}${counter++}`;
