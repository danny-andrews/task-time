import * as R from "ramda";

// Math
export const isOdd = (num) => num % 2 === 1;

export const div = (x, y) => Math.floor(x / y);

export const median = (numbers) => {
  if (numbers.length === 0) {
    throw new Error("Can't find the median of an empty list!");
  }

  const sortedNumbers = numbers.sort((a, b) => a - b);
  const length = sortedNumbers.length;
  return isOdd(length)
    ? sortedNumbers[div(length, 2)]
    : (sortedNumbers[length / 2 - 1] + sortedNumbers[length / 2]) / 2;
};

// List
export const mapIndexed = R.addIndex(R.map);

// Function
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
