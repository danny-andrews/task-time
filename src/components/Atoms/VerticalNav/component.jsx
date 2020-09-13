import React from "react";
import styles from "./.module.css";

const VerticalNav = ({ children }) => (
  <nav className={styles["vertical-nav"]}>{children}</nav>
);

export default VerticalNav;
