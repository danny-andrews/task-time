import React from "react";
import { VerticalNav, IconButton } from "../Atoms";
import { Home, LeftArrow, DoubleLeftArrow } from "../Icons";

const LeftNav = ({
  onLeftArrowClick,
  onDoubleLeftArrowClick,
  onHomeClick,
  numDaysInView,
}) => {
  return (
    <VerticalNav>
      <IconButton
        onClick={onLeftArrowClick}
        aria-label="Shift backward one day"
      >
        <LeftArrow />
      </IconButton>
      <IconButton
        onClick={onDoubleLeftArrowClick}
        aria-label={`Shift backward ${numDaysInView} days`}
      >
        <DoubleLeftArrow />
      </IconButton>
      <IconButton onClick={onHomeClick} aria-label="Shift to today">
        <Home />
      </IconButton>
    </VerticalNav>
  );
};

export default LeftNav;
