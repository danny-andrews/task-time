import React, { forwardRef, Children, cloneElement } from "react";
import { isEmpty, isNil } from "ramda";
import cn from "classnames";
import styles from "./.module.css";

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
      isDisabled: isNil(childProps.isDisabled)
        ? isDisabled
        : childProps.isDisabled,
    });
  };

  return (
    <Tag ref={ref} className={classes} style={style}>
      {Children.toArray(children)
        .filter((child) => !isEmpty(child))
        .map(transformChild)}
    </Tag>
  );
};

export default forwardRef(ButtonGroup);
