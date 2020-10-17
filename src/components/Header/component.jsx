import React from "react";
import cn from "classnames";
import styles from "./styles.module.css";
import { H } from "../Atoms";

const Header = ({ className }) => {
  const classnames = cn(styles.root, className);

  return (
    <header className={classnames}>
      <H level={1} styleLevel={3}>
        Task Time
      </H>
    </header>
  );
};

export default Header;
