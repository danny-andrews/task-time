import React from "react";
import Toggle from "react-toggle";
import * as R from "ramda";
import LabeledInput from "../LabeledInput";
import "./styles.css";
import "react-toggle/style.css";

const Switch = ({
  className,
  label,
  horizontal,
  checkedIcon,
  uncheckedIcon,
  ...props
}) => (
  <LabeledInput
    className={className}
    label={label}
    name={props.name}
    horizontal={horizontal}
  >
    <Toggle
      icons={{
        checked: <span className="switch-icon">{checkedIcon}</span>,
        unchecked: <span className="switch-icon">{uncheckedIcon}</span>,
      }}
      {...R.omit(["value"], props)}
    />
  </LabeledInput>
);

export default Switch;
