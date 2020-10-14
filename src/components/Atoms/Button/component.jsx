import React, { forwardRef } from "react";
import cn from "classnames";
import styles from "./styles.module.css";

const Button = forwardRef(
  (
    { className, children, variation = "primary", isDisabled = false, ...rest },
    ref
  ) => {
    const classes = cn(className, styles[variation], {
      [styles.disabled]: isDisabled,
    });
    const tabIndex = isDisabled ? -1 : 0;

    return (
      <button
        type="button"
        className={classes}
        ref={ref}
        tabIndex={tabIndex}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

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
