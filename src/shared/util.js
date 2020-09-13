import { map, addIndex, always } from "ramda";

export const mapIndexed = addIndex(map);

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

export const noop = always;
