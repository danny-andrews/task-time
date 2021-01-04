export default (namespace) => {
  const expandKey = (key) => [namespace, key].join("/");

  const get = (key) => JSON.parse(window.localStorage.getItem(expandKey(key)));

  const set = (key, value) => {
    window.localStorage.setItem(expandKey(key), JSON.stringify(value));
  };

  return { get, set };
};
