import * as R from "ramda";
import { useState, useEffect } from "react";
import LocalStorage from "./local-storage";

export default () => {
  const ls = LocalStorage("task-time-config");

  if (R.isNil(ls.get("use-dark-scheme"))) {
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)");
    ls.set("use-dark-scheme", darkMode.matches);
  }

  const useDarkMode = () => {
    const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
    useEffect(() => {
      setIsDarkModeEnabled(ls.get("use-dark-scheme"));
    }, []);
    useEffect(() => {
      const rootClassList = document.querySelector("html").classList;
      if (isDarkModeEnabled) {
        rootClassList.add("dark-mode");
      } else {
        rootClassList.remove("dark-mode");
      }
    }, [isDarkModeEnabled]);
    const handleChange = (checked) => {
      setIsDarkModeEnabled(checked);
      ls.set("use-dark-scheme", checked);
    };

    return [isDarkModeEnabled, handleChange];
  };

  return { useDarkMode };
};
