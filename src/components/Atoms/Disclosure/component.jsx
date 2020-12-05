import React, { useState } from "react";
import {
  Disclosure as ReachDisclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@reach/disclosure";
import styles from "./styles.module.css";
import { SquareButton } from "../Button";
import { DownArrow, RightArrow } from "../../Icons";

const Disclosure = ({ buttonText, children, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className}>
      <ReachDisclosure open={isOpen}>
        <DisclosureButton
          onClick={() => setIsOpen(!isOpen)}
          as={SquareButton}
          className={styles.button}
        >
          {isOpen ? (
            <DownArrow className={styles.icon} />
          ) : (
            <RightArrow className={styles.icon} />
          )}
          {buttonText}
        </DisclosureButton>
        <DisclosurePanel className={styles.panel}>
          {isOpen && children}
        </DisclosurePanel>
      </ReachDisclosure>
    </div>
  );
};

export default Disclosure;
