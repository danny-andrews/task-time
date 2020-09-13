import React from "react";
import { Field } from "formik";
import LabeledInput from "../LabeledInput";
import styles from "./.module.css";

const Input = ({ label, focused, ...props }) => (
  <LabeledInput label={label} name={props.name}>
    <Field className={styles.root} {...props} />
  </LabeledInput>
);

export default Input;
