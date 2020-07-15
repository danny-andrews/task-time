import React, { useState } from "react";
import styles from "./.module.css";
import { uniqueId } from "../../../shared/util";

const LabeledInput = ({ label, name, children }) => {
  const [id] = useState(uniqueId(`${name}-`));

  return (
    <div>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children(id)}
    </div>
  );
};

export default LabeledInput;
