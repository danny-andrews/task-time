import React from "react";
import { Field } from "formik";
import LabeledInput from "../LabeledInput";
import styles from "./styles.module.css";

const Checkbox = ({ label, ...props }) => (
  <LabeledInput label={label} name={props.name}>
    <Field className={styles.root} type="checkbox" {...props} />
  </LabeledInput>
);

export default Checkbox;
