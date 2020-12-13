import React, { useContext, useEffect } from "react";
import * as R from "ramda";
import { getTasksForDates } from "../../data/model";
import DayColumns from "../../components/DayColumns";
import Header from "../../components/Header";
import styles from "./styles.module.css";
import LeftNav from "../../components/LeftNav";
import RightNav from "../../components/RightNav";
import BottomNav from "../../components/BottomNav";
import { useDevice, useDateWindow } from "../../hooks";
import { PersistenceContext } from "../../shared";

const Index = () => {
  const { useTasksByDisplayDate, useRecommendedDifficulty } = useContext(
    PersistenceContext
  );
  const tasks = useTasksByDisplayDate();
  const recommendedDifficulty = useRecommendedDifficulty();

  const numDaysInView = useDevice(500).case({
    Phone: R.always(1),
    Tablet: R.always(2),
    TabletLarge: R.always(3),
    Desktop: R.always(4),
    DesktopLarge: R.always(5),
  });

  const dateWindow = useDateWindow(numDaysInView);
  const [
    dates,
    { goToPrevDay, shiftBackward, goToNextDay, shiftForward, goToCurrentDate },
  ] = dateWindow;
  const tasksInView = getTasksForDates(dates, tasks);
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--recommended-difficulty",
      recommendedDifficulty
    );
  }, [recommendedDifficulty]);

  return (
    <section className={styles.root}>
      <Header className={styles.header} />
      <LeftNav
        className={styles["left-nav"]}
        onLeftArrowClick={goToPrevDay}
        onDoubleLeftArrowClick={shiftBackward}
        numDaysInView={numDaysInView}
      />
      <DayColumns
        className={styles["main"]}
        tasksByDay={tasksInView}
        dateWindow={dateWindow}
      />
      <RightNav
        className={styles["right-nav"]}
        onRightArrowClick={goToNextDay}
        onDoubleRightArrowClick={shiftForward}
        onHomeClick={goToCurrentDate}
        numDaysInView={numDaysInView}
      />
      <BottomNav
        className={styles["bottom-nav"]}
        onLeftArrowClick={goToPrevDay}
        onRightArrowClick={goToNextDay}
        onHomeClick={goToCurrentDate}
      />
    </section>
  );
};

export default Index;
