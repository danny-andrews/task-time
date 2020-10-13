import React from "react";
import styles from "./styles.module.css";
import { H } from "../Atoms";

const Header = () => (
  <header className={styles.root}>
    <H level={1}>Task Time</H>
  </header>
);

export default Header;
