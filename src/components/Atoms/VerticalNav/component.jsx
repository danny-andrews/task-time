import React from "react";
import cn from "classnames";
import styles from "./.module.css";
import utilStyles from "../index.module.css";

const VerticalNav = ({ children }) => {
  const classes = cn(styles["vertical-nav"], utilStyles["inner-spacing-small"]);

  return <nav className={classes}>{children}</nav>;
};

export default VerticalNav;
