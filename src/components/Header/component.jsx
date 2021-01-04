import React from "react";
import cn from "classnames";
import { useUserConfig } from "../../hooks";
import styles from "./styles.module.css";
import { H, Switch } from "../Atoms";

const Header = ({ className }) => {
  const [
    isDarkModeEnabled,
    setIsDarkModeEnabled,
  ] = useUserConfig().useDarkMode();

  return (
    <header className={cn(styles.root, className)}>
      <H level={1} styleLevel={3}>
        Task Time
      </H>
      <Switch
        className={styles.right}
        horizontal
        label="Dark mode"
        name="darkModeActive"
        checked={isDarkModeEnabled}
        onChange={(e) => setIsDarkModeEnabled(e.target.checked)}
      />
    </header>
  );
};

export default Header;
