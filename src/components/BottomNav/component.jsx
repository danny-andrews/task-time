import React from "react";
import cn from "classnames";
import { IconButton } from "../Atoms";
import { RightArrow, LeftArrow, Home } from "../Icons";
import styles from "./styles.module.css";

const BottomNav = ({
  className,
  onRightArrowClick,
  onLeftArrowClick,
  onHomeClick,
}) => (
  <footer className={cn(styles.root, className)}>
    <IconButton onClick={onLeftArrowClick} aria-label="Shift backward one day">
      <LeftArrow />
    </IconButton>
    <IconButton onClick={onRightArrowClick} aria-label="Shift forward one day">
      <RightArrow />
    </IconButton>
    <IconButton onClick={onHomeClick} aria-label="Go to today">
      <Home />
    </IconButton>
  </footer>
);

export default BottomNav;
