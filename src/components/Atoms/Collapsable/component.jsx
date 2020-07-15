import React, { useState } from "react";
import styles from "./.module.css";
import { SquareButton } from "../";

const Collapsable = ({ buttonText, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => setIsOpen(!isOpen);

  return (
    <details className={styles.root}>
      <SquareButton onClick={handleClick} as="summary">
        {buttonText}
      </SquareButton>
      {isOpen && children}
    </details>
  );
};

export default Collapsable;
