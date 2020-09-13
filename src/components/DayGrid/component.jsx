import React from "react";
import { always as alvvays } from "ramda";
import { useBreakpoint, useDateWindow } from "../../hooks";
import DayColumns from "../DayColumns";
import LeftNav from "../LeftNav";
import RightNav from "../RightNav";
import styles from "./.module.css";
import { getTasksForDates } from "../../shared/model";

const DayGrid = ({ tasks }) => {
  const {
    goToPrevDay,
    shiftBackward,
    goToNextDay,
    shiftForward,
    goToCurrentDate,
    dateWindow,
  } = useDateWindow(
    useBreakpoint(500).case({
      Phone: alvvays(1),
      Tablet: alvvays(2),
      Desktop: alvvays(3),
      DesktopLarge: alvvays(4),
    })
  );

  const tasksInView = getTasksForDates(dateWindow.dates, tasks);

  return (
    <section className={styles.root}>
      <LeftNav
        onLeftArrowClick={goToPrevDay}
        onDoubleLeftArrowClick={shiftBackward}
        onHomeClick={goToCurrentDate}
      />
      <DayColumns tasksByDay={tasksInView} />
      <RightNav
        onRightArrowClick={goToNextDay}
        onDoubleRightArrowClick={shiftForward}
      />
    </section>
  );
};

export default DayGrid;
