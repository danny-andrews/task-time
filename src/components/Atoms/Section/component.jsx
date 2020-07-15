import React, { useContext } from "react";
import { LevelContext } from "../../../shared/contexts";

const Section = ({ children }) => {
  const level = useContext(LevelContext) + 1;

  return (
    <LevelContext.Provider value={level}>{children}</LevelContext.Provider>
  );
};

export default Section;
