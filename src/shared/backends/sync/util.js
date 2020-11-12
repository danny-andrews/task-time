import * as Y from "yjs";

export const setMany = (spec, yMap) => {
  Object.entries(spec).forEach(([key, value]) => {
    yMap.set(key, value);
  });
};

export const createMap = (spec) => {
  const yMap = new Y.Map();
  setMany(spec, yMap);

  return yMap;
};

export const initializeMap = (spec, yMap = new Y.Map()) => {
  Object.entries(spec).forEach(([key, value]) => {
    yMap.set(key, value);
  });

  return yMap;
};

export const initializeArray = (values, yArray = new Y.Array()) => {
  values.forEach((value) => {
    yArray.unshift([value]);
  });

  return yArray;
};
