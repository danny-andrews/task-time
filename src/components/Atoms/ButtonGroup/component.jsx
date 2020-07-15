import React from "react";
import cn from "classnames";
import styles from "./.module.css";

const ButtonGroup = ({ className, children }) => {
  const classes = cn(className, styles.root);

  return <div className={classes}>{children}</div>;
};

export default ButtonGroup;
