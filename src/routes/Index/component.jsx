import React, { useContext } from "react";
import * as R from "ramda";
import { getTasksForDates } from "../../shared/model";
import DayColumns from "../../components/DayColumns";
import Header from "../../components/Header";
import styles from "./styles.module.css";
import LeftNav from "../../components/LeftNav";
import RightNav from "../../components/RightNav";
import { useDevice, useDateWindow } from "../../hooks";
import { PersistenceContext } from "../../shared/contexts";

const Index = () => {
  const { useTasksByDisplayDate } = useContext(PersistenceContext);
  const tasks = useTasksByDisplayDate();

  const numDaysInView = useDevice(500).case({
    Phone: R.always(1),
    Tablet: R.always(2),
    TabletLarge: R.always(3),
    Desktop: R.always(4),
    DesktopLarge: R.always(5),
  });

  const [
    dates,
    { goToPrevDay, shiftBackward, goToNextDay, shiftForward, goToCurrentDate },
  ] = useDateWindow(numDaysInView);
  const tasksInView = getTasksForDates(dates, tasks);

  return (
    <section className={styles.root}>
      <Header className={styles.header} />
      <LeftNav
        className={styles["left-nav"]}
        onLeftArrowClick={goToPrevDay}
        onDoubleLeftArrowClick={shiftBackward}
        onHomeClick={goToCurrentDate}
        numDaysInView={numDaysInView}
      />
      <DayColumns className={styles["main"]} tasksByDay={tasksInView} />
      <RightNav
        className={styles["right-nav"]}
        onRightArrowClick={goToNextDay}
        onDoubleRightArrowClick={shiftForward}
        numDaysInView={numDaysInView}
      />
    </section>
  );
};

export default Index;
