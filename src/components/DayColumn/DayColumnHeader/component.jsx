import React, { useContext } from "react";
import cn from "classnames";
import { isToday } from "date-fns";
import styles from "./styles.module.css";
import {
  formatHumanReadable,
  isPastDate,
  PersistenceContext,
} from "../../../shared";
import { H, IconButton, Progress } from "../../Atoms";
import { Sort, Partition } from "../../Icons";

const DayColumnHeader = ({
  date,
  difficulty,
  onSortClick,
  onPartitionClick,
}) => {
  const isInPast = isPastDate(date);
  const recommendedDifficulty = useContext(
    PersistenceContext
  ).useRecommendedDifficulty();

  return (
    <header
      className={cn(styles.header, {
        [styles.faded]: isInPast,
        [styles.accent]: isToday(date),
      })}
    >
      <H level={2} styleLevel={5} className={styles.date}>
        {formatHumanReadable(date)}
      </H>
      <IconButton
        isDisabled={isInPast}
        onClick={onSortClick}
        className={cn(styles["icon-button"], styles.left)}
        aria-label="Sort tasks"
      >
        <Sort />
      </IconButton>
      <Progress
        className={styles.difficulty}
        label="Difficulty"
        max={recommendedDifficulty}
        current={difficulty}
      />
      <IconButton
        isDisabled={isInPast}
        onClick={onPartitionClick}
        className={cn(styles["icon-button"], styles.right)}
        aria-label="Repartition tasks"
      >
        <Partition />
      </IconButton>
    </header>
  );
};

export default DayColumnHeader;
