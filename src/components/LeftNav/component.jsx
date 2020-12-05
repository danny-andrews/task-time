import React from "react";
import { VerticalNav, IconButton } from "../Atoms";
import { LeftArrow, DoubleLeftArrow } from "../Icons";

const LeftNav = ({
  onLeftArrowClick,
  onDoubleLeftArrowClick,
  numDaysInView,
  className,
}) => (
  <VerticalNav className={className}>
    <IconButton onClick={onLeftArrowClick} aria-label="Shift backward one day">
      <LeftArrow />
    </IconButton>
    {numDaysInView > 1 && (
      <IconButton
        onClick={onDoubleLeftArrowClick}
        aria-label={`Shift backward ${numDaysInView} days`}
      >
        <DoubleLeftArrow />
      </IconButton>
    )}
  </VerticalNav>
);

export default LeftNav;
