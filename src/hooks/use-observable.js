import { useState, useEffect } from "react";

export default (initialValue, observable) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const cb = (newValue) => {
      setValue(newValue);
    };
    observable.onValue(cb);

    return () => observable.offValue(cb);
  }, []);

  return value;
};
