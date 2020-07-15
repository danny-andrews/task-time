import { useState, useEffect } from "react";
import { debounce } from "../shared/util";
import { DeviceFactory } from "../shared/constants";

export const useWindowSize = (debounceTime = 500) => {
  const [windowSize, setWindowSize] = useState({ width: null, height: null });

  useEffect(() => {
    const getSize = () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setWindowSize(getSize());
    };
    const handleResizeDebounced = debounce(handleResize, debounceTime);

    window.addEventListener("resize", handleResizeDebounced);

    handleResize();

    return () => window.removeEventListener("resize", handleResizeDebounced);
  }, [debounceTime]);

  return windowSize;
};

export const useBreakpoint = () => {
  const { width } = useWindowSize();

  return DeviceFactory(width);
};
