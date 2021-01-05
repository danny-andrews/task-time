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
      <div className={styles.actions}>
        <div className={styles.sort}>
          <IconButton
            isDisabled={isInPast}
            onClick={onSortClick}
            className={styles["icon-button"]}
            aria-label="Sort tasks"
          >
            <Sort />
          </IconButton>
        </div>
        <div className={styles.difficulty}>
          <Progress
            label="Difficulty"
            max={recommendedDifficulty}
            current={difficulty}
          />
        </div>
        <div className={styles.partition}>
          <IconButton
            isDisabled={isInPast}
            onClick={onPartitionClick}
            className={styles["icon-button"]}
            aria-label="Repartition tasks"
          >
            <Partition />
          </IconButton>
        </div>
      </div>
    </header>
  );
};

export default DayColumnHeader;
