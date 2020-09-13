import React from "react";
import cn from "classnames";
import { clamp } from "ramda";
import styles from "./.module.css";

const H = ({ children, className, ...props }) => {
  const clampLevel = clamp(1, 6);
  const level = clampLevel(props.level);
  const styleLevel = clampLevel(props.styleLevel) || level;
  const Tag = `h${level}`;
  const classNames = cn(className, styles[`h${styleLevel}`]);

  return <Tag className={classNames}>{children}</Tag>;
};

export default H;
