import React from "react";
import { parseISO } from "date-fns";
import cn from "classnames";
import DayColumn from "../DayColumn";
import styles from "./styles.module.css";

const DayColumns = ({ className, tasksByDay }) => (
  <ol className={cn(styles.root, className)}>
    {tasksByDay.map(({ date, tasks }) => (
      <DayColumn key={date} tasks={tasks} date={parseISO(date)} />
    ))}
  </ol>
);

export default DayColumns;
