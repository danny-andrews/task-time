import React from "react";
import cn from "classnames";
import styles from "./styles.module.css";

const VerticalNav = ({ children, className }) => {
  const classes = cn(styles.root, className);

  return <nav className={classes}>{children}</nav>;
};

export default VerticalNav;
