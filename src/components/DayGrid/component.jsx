import React, { useState, useContext } from "react";
import { always as alvvays, propOr } from "ramda";
import { useQuery } from "react-query";
import DateWindow from "../../shared/date-window";
import { useBreakpoint } from "../../hooks";
import DayColumn from "../DayColumn";
import styles from "./.module.css";
import { tasksByDisplayDate } from "../../shared/selectors";
import { BackendContext } from "../../shared/contexts";
import { VerticalNav, IconButton } from "../Atoms";
import {
  Home,
  RightArrow,
  LeftArrow,
  DoubleRightArrow,
  DoubleLeftArrow,
} from "../Icons";

const DayGrid = () => {
  const breakpoint = useBreakpoint();
  const columnCount = breakpoint.case({
    Phone: alvvays(1),
    Tablet: alvvays(2),
    Desktop: alvvays(3),
    DesktopLarge: alvvays(4),
  });

  const [startDate, setStartDate] = useState(new Date());
  const dateWindow = DateWindow(startDate, columnCount);

  const goToPrevDay = () => {
    setStartDate(dateWindow.decr().startDate);
  };
  const shiftBackward = () => {
    setStartDate(dateWindow.prev().startDate);
  };

  const goToNextDay = () => {
    setStartDate(dateWindow.incr().startDate);
  };
  const shiftForward = () => {
    setStartDate(dateWindow.next().startDate);
  };
  const goToCurrentDate = () => {
    setStartDate(new Date());
  };

  const backend = useContext(BackendContext);
  const { data = [] } = useQuery("tasks", backend.getTasks);
  const tasks = tasksByDisplayDate(data);

  const tasksInView = dateWindow.dates.map((date) => ({
    date,
    tasks: propOr([], date, tasks),
  }));

  return (
    <section className={styles.root}>
      <VerticalNav>
        <IconButton onClick={goToPrevDay}>
          <LeftArrow />
        </IconButton>
        <IconButton onClick={shiftBackward}>
          <DoubleLeftArrow />
        </IconButton>
        <IconButton onClick={goToCurrentDate}>
          <Home />
        </IconButton>
      </VerticalNav>
      <ol className={styles.columns}>
        {tasksInView.map(({ date, tasks: tasksForDay }) => (
          <DayColumn key={date} tasks={tasksForDay} date={date} />
        ))}
      </ol>
      <VerticalNav>
        <IconButton onClick={goToNextDay}>
          <RightArrow />
        </IconButton>
        <IconButton onClick={shiftForward}>
          <DoubleRightArrow />
        </IconButton>
      </VerticalNav>
    </section>
  );
};

export default DayGrid;
