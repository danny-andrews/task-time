import React, { forwardRef } from "react";
import cn from "classnames";
import styles from "./.module.css";

const Button = forwardRef(
  (
    { className, children, as = "button", variation = "primary", ...rest },
    ref
  ) => {
    const classes = cn(className, styles[variation]);
    const Tag = as;

    return (
      <Tag className={classes} {...rest} ref={ref}>
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
