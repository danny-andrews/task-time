import React from "react";
import { always as alvvays } from "ramda";
import { getTasksByDisplayDate, getTasksForDates } from "../../shared/model";
import DayColumns from "../../components/DayColumns";
import Header from "../../components/Header";
import styles from "./styles.module.css";
import LeftNav from "../../components/LeftNav";
import RightNav from "../../components/RightNav";
import { useBackend, useDevice, useDateWindow } from "../../hooks";

const Index = () => {
  const { useTasks } = useBackend();
  const data = useTasks();
  const tasks = getTasksByDisplayDate(data);

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
      <Header className={styles.header} />
      <LeftNav
        className={styles["left-nav"]}
        onLeftArrowClick={goToPrevDay}
        onDoubleLeftArrowClick={shiftBackward}
        onHomeClick={goToCurrentDate}
        numDaysInView={dateWindowSize}
      />
      <DayColumns className={styles["main"]} tasksByDay={tasksInView} />
      <RightNav
        className={styles["right-nav"]}
        onRightArrowClick={goToNextDay}
        onDoubleRightArrowClick={shiftForward}
        numDaysInView={dateWindowSize}
      />
    </section>
  );
};

export default Index;
