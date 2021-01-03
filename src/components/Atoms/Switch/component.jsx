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
  checked,
  onChange,
  ...props
}) => (
  <LabeledInput
    className={className}
    label={label}
    name={props.name}
    horizontal={horizontal}
  >
    <Toggle
      {...R.omit(["value"], props)}
      icons={false}
      onChange={onChange}
      checked={checked}
    />
  </LabeledInput>
);

export default Switch;
