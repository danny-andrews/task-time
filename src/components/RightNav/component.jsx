import React from "react";
import { VerticalNav, IconButton } from "../Atoms";
import { RightArrow, DoubleRightArrow } from "../Icons";

const RightNav = ({ onRightArrowClick, onDoubleRightArrowClick }) => (
  <VerticalNav>
    <IconButton onClick={onRightArrowClick}>
      <RightArrow />
    </IconButton>
    <IconButton onClick={onDoubleRightArrowClick}>
      <DoubleRightArrow />
    </IconButton>
  </VerticalNav>
);

export default RightNav;
