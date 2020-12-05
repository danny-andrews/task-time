import React from "react";
import { VerticalNav, IconButton } from "../Atoms";
import { RightArrow, DoubleRightArrow, Home } from "../Icons";

const RightNav = ({
  onRightArrowClick,
  onDoubleRightArrowClick,
  numDaysInView,
  className,
  onHomeClick,
}) => (
  <VerticalNav className={className}>
    <IconButton onClick={onRightArrowClick} aria-label="Shift forward one day">
      <RightArrow />
    </IconButton>
    {numDaysInView > 1 && (
      <IconButton
        onClick={onDoubleRightArrowClick}
        aria-label={`Shift forward ${numDaysInView} days`}
      >
        <DoubleRightArrow />
      </IconButton>
    )}
    <IconButton onClick={onHomeClick} aria-label="Go to today">
      <Home />
    </IconButton>
  </VerticalNav>
);

export default RightNav;
