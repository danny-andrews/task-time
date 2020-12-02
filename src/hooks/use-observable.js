import { useState, useEffect } from "react";
import flyd from "flyd";

export default (initialValue, observable) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const result = flyd.on((newValue) => {
      setValue(newValue);
    }, observable);

    return () => {
      result.end(true);
    };
  }, []);

  return value;
};
