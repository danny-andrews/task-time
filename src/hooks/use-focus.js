import { useEffect, useRef } from "react";

export default () => {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return ref;
};
