import React, { useState, useRef } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@reach/disclosure";
import styles from "./.module.css";
import { SquareButton } from "../";
import { noop } from "../../../shared/util";

const Collapsable = ({ buttonText, children, onDisplay = noop }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const handleClick = () => {
    const newState = !isOpen;

    setIsOpen(newState);
    panelRef.current.hidden = !newState;
    if (newState) onDisplay();
  };

  return (
    <div className={styles.root}>
      <Disclosure open={isOpen} className={styles.root}>
        <DisclosureButton onClick={handleClick} as={SquareButton}>
          {buttonText}
        </DisclosureButton>
        <DisclosurePanel className={styles.panel} ref={panelRef}>
          {children}
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
};

export default Collapsable;
