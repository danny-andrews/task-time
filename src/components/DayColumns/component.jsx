import React from "react";
import DayColumn from "../DayColumn";
import styles from "./.module.css";
import { parseISO } from "date-fns";

const DayColumns = ({ tasksByDay }) => (
  <ol className={styles.root}>
    {tasksByDay.map(({ date, tasks }) => (
      <DayColumn key={date} tasks={tasks} date={parseISO(date)} />
    ))}
  </ol>
);

export default DayColumns;
