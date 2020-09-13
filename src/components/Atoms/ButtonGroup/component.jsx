import React, { forwardRef, Children, cloneElement } from "react";
import { isEmpty } from "ramda";
import cn from "classnames";
import styles from "./.module.css";

const addClassNameToElement = (className, element) =>
  cloneElement(element, { className: cn(className, element.props.className) });

const ButtonGroup = forwardRef(({ className, children, as = "div" }, ref) => {
  const classes = cn(className, styles.root);
  const Tag = as;
  const transformChild = (child) => addClassNameToElement(styles.button, child);

  return (
    <Tag ref={ref} className={classes}>
      {Children.toArray(children)
        .filter((child) => !isEmpty(child))
        .map(transformChild)}
    </Tag>
  );
});

export default ButtonGroup;
