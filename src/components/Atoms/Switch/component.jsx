import React from "react";
import Toggle from "react-toggle";
import { useField } from "formik";
import LabeledInput from "../LabeledInput";
import "./styles.css";
import "react-toggle/style.css";

const Switch = ({ label, ...props }) => {
  const [{ value }, , { setValue }] = useField(props.name);
  const handleChange = (e) => setValue(e.target.checked);

  return (
    <LabeledInput label={label} name={props.name}>
      <Toggle
        {...props}
        icons={false}
        onChange={handleChange}
        checked={value}
      />
    </LabeledInput>
  );
};

export default Switch;
