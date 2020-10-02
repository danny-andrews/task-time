import React, { useState, useRef } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@reach/disclosure";
import styles from "./.module.css";
import { SquareButton } from "../";
import { DownArrow, RightArrow } from "../../Icons";
import { noop } from "../../../shared/util";

const Collapsable = ({ buttonText, children, onDisplay = noop }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const handleClick = (e) => {
    const newState = !isOpen;

    setIsOpen(newState);
    panelRef.current.hidden = !newState;
    if (newState) onDisplay();
    e.preventDefault();
  };
  const renderArrow = () =>
    isOpen ? (
      <DownArrow className={styles.icon} />
    ) : (
      <RightArrow className={styles.icon} />
    );

  return (
    <div className={styles.root}>
      <Disclosure open={isOpen} className={styles.root}>
        <DisclosureButton
          onClick={handleClick}
          as={SquareButton}
          className={styles.button}
        >
          {renderArrow()}
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
