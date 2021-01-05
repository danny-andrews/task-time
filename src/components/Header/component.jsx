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
      <div className={styles.right}>
        <Switch
          className={styles.right}
          horizontal
          checkedIcon={
            <span role="img" aria-label="Sun">
              &#x2600;&#xFE0F;
            </span>
          }
          unCheckedIcon={
            <span role="img" aria-label="Moon">
              &#x1F319;
            </span>
          }
          name="darkModeActive"
          checked={isDarkModeEnabled}
          onChange={(e) => setIsDarkModeEnabled(e.target.checked)}
        />
      </div>
    </header>
  );
};

export default Header;
