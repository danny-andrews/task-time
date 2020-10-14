import React from "react";
import { always as alvvays } from "ramda";
import { useDevice, useDateWindow } from "../../hooks";
import DayColumns from "../DayColumns";
import LeftNav from "../LeftNav";
import RightNav from "../RightNav";
import styles from "./styles.module.css";
import { getTasksForDates } from "../../shared/model";

const DayGrid = ({ tasks }) => {
  const dateWindowSize = useDevice(500).case({
    Phone: alvvays(1),
    Tablet: alvvays(2),
    TabletLarge: alvvays(3),
    Desktop: alvvays(4),
    DesktopLarge: alvvays(5),
  });

  const [
    dates,
    { goToPrevDay, shiftBackward, goToNextDay, shiftForward, goToCurrentDate },
  ] = useDateWindow(dateWindowSize);

  const tasksInView = getTasksForDates(dates, tasks);

  return (
    <section className={styles.root}>
      <LeftNav
        onLeftArrowClick={goToPrevDay}
        onDoubleLeftArrowClick={shiftBackward}
        onHomeClick={goToCurrentDate}
        numDaysInView={dateWindowSize}
      />
      <DayColumns tasksByDay={tasksInView} />
      <RightNav
        onRightArrowClick={goToNextDay}
        onDoubleRightArrowClick={shiftForward}
        numDaysInView={dateWindowSize}
      />
    </section>
  );
};

export default DayGrid;
