import React, { forwardRef } from "react";
import cn from "classnames";
import styles from "./.module.css";

const Button = forwardRef(
  (
    {
      className,
      children,
      as = "button",
      variation = "primary",
      isDisabled = false,
      ...rest
    },
    ref
  ) => {
    const classes = cn(className, styles[variation], {
      [styles.disabled]: isDisabled,
    });
    const Tag = as;
    const tabIndex = isDisabled ? -1 : 0;

    return (
      <Tag className={classes} ref={ref} tabIndex={tabIndex} {...rest}>
        {children}
      </Tag>
    );
  }
);

const buttonVariationFactory = (variation) =>
  forwardRef(({ ...props }, ref) => (
    <Button variation={variation} {...props} ref={ref} />
  ));

export const IconButton = buttonVariationFactory("icon");

export const SquareButton = buttonVariationFactory("square");

export default Button;
