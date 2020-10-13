import React from "react";
import styles from "./styles.module.css";

const VerticalNav = ({ children }) => (
  <nav className={styles["vertical-nav"]}>{children}</nav>
);

export default VerticalNav;
