import React from "react";
import { Field } from "formik";
import LabeledInput from "../LabeledInput";
import styles from "./.module.css";

const Input = ({ label, ...props }) => (
  <LabeledInput label={label} name={props.name}>
    <Field className={styles.root} type="text" {...props} />
  </LabeledInput>
);

export default Input;
