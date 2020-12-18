import React, { forwardRef } from "react";
import cn from "classnames";
import styles from "./styles.module.css";

const Button = forwardRef(
  (
    {
      className,
      children,
      variation = "primary",
      type = "button",
      isDisabled = false,
      fullWidth = false,
      ...rest
    },
    ref
  ) => (
    <button
      type={type}
      className={cn(className, styles[variation], {
        [styles.disabled]: isDisabled,
        [styles["full-width"]]: fullWidth,
      })}
      ref={ref}
      tabIndex={isDisabled ? -1 : 0}
      {...rest}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";

export const IconButton = forwardRef((props, ref) => (
  <Button variation="icon" {...props} ref={ref} />
));
IconButton.displayName = "IconButton";

export const SquareButton = forwardRef((props, ref) => (
  <Button variation="square" {...props} ref={ref} />
));
SquareButton.displayName = "SquareButton";

export const PrimaryButton = forwardRef((props, ref) => (
  <Button {...props} ref={ref} />
));
PrimaryButton.displayName = "PrimaryButton";
