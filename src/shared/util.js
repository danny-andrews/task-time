import * as R from "ramda";

// List
export const mapIndexed = R.addIndex(R.map);

// Function
export const curry2 = R.curryN(2);
export const curry3 = R.curryN(3);

export const noop = R.always;

export const debounce = (duration, func) => {
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

export const throttle = (duration, func) => {
  let shouldWait = false;
  return (...args) => {
    if (!shouldWait) {
      func(...args);
      shouldWait = true;
      setTimeout(() => {
        shouldWait = false;
      }, duration);
    }
  };
};

// Object
export const toObjBy = (fn) =>
  R.pipe(
    R.map((val) => [fn(val), val]),
    R.fromPairs
  );

export const mapObj = (transformKey, transformValue) =>
  R.pipe(
    R.toPairs,
    R.map(([key, value]) => [transformKey(key), transformValue(value)]),
    R.fromPairs
  );

// Other
let counter = 0;
export const uniqueId = (prefix = "") => `${prefix}${counter++}`;
