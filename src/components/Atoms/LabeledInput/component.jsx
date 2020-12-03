import React from "react";
import styles from "./styles.module.css";
import cn from "classnames";

const LabeledInput = ({ label, children, className }) =>
  label ? (
    <label className={cn(styles.root, className)}>
      <div className={styles["label-text"]}>{label}</div>
      {children}
    </label>
  ) : (
    children
  );

export default LabeledInput;
