import React, { useState, useRef } from "react";
import {
  Disclosure as ReachDisclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@reach/disclosure";
import styles from "./styles.module.css";
import { SquareButton } from "../Button";
import { DownArrow, RightArrow } from "../../Icons";
import { noop } from "../../../shared/util";

const Disclosure = ({ buttonText, children, onDisplay = noop }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  // All this logic is needed because the only way to bring up the virtual
  // keyboard on mobile devices is to focus an element within a click handler,
  // initiated by a user action (not simulated via JavaScript). For more
  // information: https://stackoverflow.com/a/15133808/2433572.
  const handleClick = (e) => {
    const newState = !isOpen;

    setIsOpen(newState);
    // Syncronously display the panel contents so the form element will be
    // visible and focusable.
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
      <ReachDisclosure open={isOpen} className={styles.root}>
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
      </ReachDisclosure>
    </div>
  );
};

export default Disclosure;
