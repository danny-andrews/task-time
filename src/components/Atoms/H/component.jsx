import React, { useContext } from "react";
import cn from "classnames";
import { clamp } from "ramda";
import { LevelContext } from "../../../shared/contexts";
import styles from "./.module.css";

const H = ({ children, className, ...props }) => {
  const clampLevel = clamp(1, 6);
  const level = clampLevel(useContext(LevelContext));
  const Tag = `h${level}`;
  const styleLevel = props.styleLevel ? clampLevel(props.styleLevel) : level;
  const classNames = cn(className, styles[`h${styleLevel}`]);

  return <Tag className={classNames}>{children}</Tag>;
};

export default H;
