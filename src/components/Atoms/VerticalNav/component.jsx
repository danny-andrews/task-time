import React from "react";
import cn from "classnames";
import styles from "./styles.module.css";

const VerticalNav = ({ children, className }) => (
  <nav className={cn(styles.root, className)}>{children}</nav>
);

export default VerticalNav;
