import React from "react";
import cn from "classnames";
import DayColumn from "../DayColumn";
import styles from "./styles.module.css";

const DayColumns = ({ className, tasksByDay }) => (
  <ol className={cn(styles.root, className)}>
    {tasksByDay.map(({ date, tasks }) => (
      <DayColumn key={date} tasks={tasks} date={date} />
    ))}
  </ol>
);

export default DayColumns;
