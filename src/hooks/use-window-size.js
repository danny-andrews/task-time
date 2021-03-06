import { useState, useEffect } from "react";
import { debounce } from "../shared";

export default (debounceTime = 0) => {
  const [windowSize, setWindowSize] = useState({ width: null, height: null });

  useEffect(() => {
    const getSize = () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setWindowSize(getSize());
    };
    const handleResizeDebounced = debounce(debounceTime, handleResize);

    window.addEventListener("resize", handleResizeDebounced);

    handleResize();

    return () => window.removeEventListener("resize", handleResizeDebounced);
  }, [debounceTime]);

  return windowSize;
};
