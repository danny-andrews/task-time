import React from "react";
import cn from "classnames";
import * as R from "ramda";
import styles from "./styles.module.css";

const H = ({ children, className, ...props }) => {
  const clampLevel = R.clamp(1, 6);
  const level = clampLevel(props.level);
  const styleLevel = clampLevel(props.styleLevel) || level;
  const Tag = `h${level}`;
  const classNames = cn(className, styles[`h${styleLevel}`]);

  return <Tag className={classNames}>{children}</Tag>;
};

export default H;
