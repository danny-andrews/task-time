import React from "react";
import { VerticalNav, IconButton } from "../Atoms";
import { RightArrow, DoubleRightArrow } from "../Icons";

const RightNav = ({
  onRightArrowClick,
  onDoubleRightArrowClick,
  numDaysInView,
  className,
}) => (
  <VerticalNav className={className}>
    <IconButton onClick={onRightArrowClick} aria-label="Shift forward one day">
      <RightArrow />
    </IconButton>
    <IconButton
      onClick={onDoubleRightArrowClick}
      aria-label={`Shift forward ${numDaysInView} days`}
    >
      <DoubleRightArrow />
    </IconButton>
  </VerticalNav>
);

export default RightNav;
