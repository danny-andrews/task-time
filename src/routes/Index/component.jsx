import React from "react";
import * as R from "ramda";
import { getTasksForDates } from "../../shared/model";
import DayColumns from "../../components/DayColumns";
import Header from "../../components/Header";
import styles from "./styles.module.css";
import LeftNav from "../../components/LeftNav";
import RightNav from "../../components/RightNav";
import { useBackend, useDevice, useDateWindow } from "../../hooks";

const Index = () => {
  const { useTasksByDisplayDate } = useBackend();
  const tasks = useTasksByDisplayDate();

  const dateWindowSize = useDevice(500).case({
    Phone: R.always(1),
    Tablet: R.always(2),
    TabletLarge: R.always(3),
    Desktop: R.always(4),
    DesktopLarge: R.always(5),
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
