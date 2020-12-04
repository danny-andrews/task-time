import React, { forwardRef, Children, cloneElement } from "react";
import * as R from "ramda";
import cn from "classnames";
import styles from "./styles.module.css";

const ButtonGroup = (
  { className, children, isDisabled, as = "div", Tag = as, ...rest },
  ref
) => {
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
    <Tag ref={ref} className={cn(className, styles.root)} {...rest}>
      {Children.toArray(children)
        .filter((child) => !R.isEmpty(child))
        .map(transformChild)}
    </Tag>
  );
};

export default forwardRef(ButtonGroup);
