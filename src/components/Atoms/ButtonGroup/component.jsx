import React, { forwardRef, Children, cloneElement } from "react";
import * as R from "ramda";
import cn from "classnames";
import styles from "./styles.module.css";

const ButtonGroup = (
  { className, style, children, isDisabled, as = "div" },
  ref
) => {
  const classes = cn(className, styles.root);
  const Tag = as;
  const transformChild = (child) => {
    const childProps = child.props;

    return cloneElement(child, {
      className: cn(styles.button, childProps.className),
      ...((R.isNil(childProps.isDisabled) ? isDisabled : childProps.isDisabled)
        ? { isDisabled: true }
        : {}),
    });
  };

  return (
    <Tag ref={ref} className={classes} style={style}>
      {Children.toArray(children)
        .filter((child) => !R.isEmpty(child))
        .map(transformChild)}
    </Tag>
  );
};

export default forwardRef(ButtonGroup);
