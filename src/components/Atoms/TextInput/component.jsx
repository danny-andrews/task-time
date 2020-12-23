import React from "react";
import { Field } from "formik";
import cn from "classnames";
import LabeledInput from "../LabeledInput";
import styles from "./styles.module.css";

const Input = ({ label, className, size = "normal", ...props }) => (
  <LabeledInput label={label} name={props.name}>
    <Field
      className={cn(styles.root, className, styles[size])}
      type="text"
      {...props}
    />
  </LabeledInput>
);

export default Input;
