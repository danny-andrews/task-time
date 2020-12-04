import { useRef, useEffect } from "react";

export default () => {
  const textRef = useRef();
  useEffect(() => {
    textRef.current.focus();
  }, []);

  return textRef;
};
