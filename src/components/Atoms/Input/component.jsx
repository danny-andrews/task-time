import React from "react";
import { Field } from "formik";
import LabeledInput from "../LabeledInput";
import styles from "./.module.css";

const Input = ({ label, ...props }) => (
  <LabeledInput label={label} name={props.name}>
    {(id) => <Field className={styles.root} id={id} {...props} />}
  </LabeledInput>
);

export default Input;
