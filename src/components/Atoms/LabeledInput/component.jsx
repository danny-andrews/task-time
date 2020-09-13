import React from "react";
import styles from "./.module.css";
import cn from "classnames";

const LabeledInput = ({ label, children, className }) => (
  <label className={cn(styles.root, className)}>
    <div className={styles["label-text"]}>{label}</div>
    {children}
  </label>
);

export default LabeledInput;
