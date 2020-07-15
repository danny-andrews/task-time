import React from "react";
import cn from "classnames";
import styles from "./.module.css";

const Button = ({
  className,
  children,
  as = "button",
  variation = "primary",
  ...rest
}) => {
  const classes = cn(className, styles[variation]);
  const Tag = as;

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
};

const buttonVariationFactory = (variation) => ({ ...props }) => (
  <Button variation={variation} {...props} />
);

export const IconButton = buttonVariationFactory("icon");

export const SquareButton = buttonVariationFactory("square");

export default Button;
