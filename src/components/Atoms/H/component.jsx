import React from "react";
import cn from "classnames";
import * as R from "ramda";
import styles from "./styles.module.css";

const clampLevel = R.clamp(1, 6);

const H = ({ children, className, ...props }) => {
  const level = clampLevel(props.level);
  const styleLevel = clampLevel(props.styleLevel) || level;
  const Tag = `h${level}`;

  return (
    <Tag className={cn(className, styles[`h${styleLevel}`])}>{children}</Tag>
  );
};

export default H;
