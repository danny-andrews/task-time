import React from "react";
import cn from "classnames";
import { isToday } from "date-fns";
import styles from "./styles.module.css";
import { formatHumanReadable, isPastDate } from "../../../shared";
import { H, IconButton } from "../../Atoms";
import { Sort, Partition } from "../../Icons";

const DayColumnHeader = ({ date, difficulty, onSortClick }) => {
  const isInPast = isPastDate(date);

  return (
    <header
      className={cn(styles.header, {
        [styles.faded]: isInPast,
        [styles.accent]: isToday(date),
      })}
    >
      <H level={2} styleLevel={5}>
        {formatHumanReadable(date)}
      </H>
      <div className={styles.actions}>
        <div className={styles.partition}>
          <IconButton isDisabled={isInPast} className={styles["icon-button"]}>
            <Partition />
          </IconButton>
        </div>
        <p className={styles.difficulty}>
          Difficulty:&nbsp;<em>{difficulty}</em>
        </p>
        <div className={styles.sort}>
          <IconButton
            isDisabled={isInPast}
            onClick={onSortClick}
            className={styles["icon-button"]}
          >
            <Sort />
          </IconButton>
        </div>
      </div>
    </header>
  );
};

export default DayColumnHeader;
