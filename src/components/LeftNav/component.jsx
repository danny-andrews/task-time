import React from "react";
import { VerticalNav, IconButton } from "../Atoms";
import { Home, LeftArrow, DoubleLeftArrow } from "../Icons";

const LeftNav = ({ onLeftArrowClick, onDoubleLeftArrowClick, onHomeClick }) => {
  return (
    <VerticalNav>
      <IconButton onClick={onLeftArrowClick}>
        <LeftArrow />
      </IconButton>
      <IconButton onClick={onDoubleLeftArrowClick}>
        <DoubleLeftArrow />
      </IconButton>
      <IconButton onClick={onHomeClick}>
        <Home />
      </IconButton>
    </VerticalNav>
  );
};

export default LeftNav;
