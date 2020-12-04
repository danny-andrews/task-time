import React from "react";
import cn from "classnames";
import styles from "./styles.module.css";
import { H } from "../Atoms";

const Header = ({ className }) => (
  <header className={cn(styles.root, className)}>
    <H level={1} styleLevel={3}>
      Task Time
    </H>
  </header>
);

export default Header;
