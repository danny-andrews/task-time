import React, { forwardRef, useContext } from "react";
import cn from "classnames";
import { useDrop } from "react-dnd";
import { isToday, isSameDay } from "date-fns";
import TaskForm from "../TaskForm";
import Tasks from "../Tasks";
import styles from "./styles.module.css";
import {
  DND_IDS,
  formatHumanReadable,
  isPastDate,
  PersistenceContext,
} from "../../shared";
import { H, Disclosure } from "../Atoms";

const DayColumn = forwardRef(({ date, tasks, blocked, faded }, ref) => {
  const { createTask, getTotalDifficulty } = useContext(PersistenceContext);

  const renderTaskForm = () => {
    if (isPastDate(date)) return null;

    const handleSubmit = ({ important, ...rest }) =>
      createTask({
        ...rest,
        isImportant: important,
        dueDate: date,
        position: tasks.length,
      });

    return (
      <Disclosure buttonText="New Task" className={styles.disclosure}>
        <TaskForm onSubmit={handleSubmit} />
      </Disclosure>
    );
  };

  return (
    <li ref={ref} className={styles.root}>
      <header
        className={cn(styles.header, {
          [styles["faded"]]: faded,
          [styles["accent"]]: isToday(date),
        })}
      >
        <H level={2} styleLevel={4}>
          {formatHumanReadable(date)}
        </H>
        <p>
          Total Difficulty: <em>{getTotalDifficulty(tasks)}</em>
        </p>
      </header>
      <div
        className={cn(styles["tasks-section"], {
          [styles["blocked"]]: blocked,
        })}
      >
        <Tasks tasks={tasks} />
        {renderTaskForm()}
      </div>
    </li>
  );
});
DayColumn.displayName = "DayColumn";

const DroppableDayColumn = ({ date, tasks }) => {
  const { moveTask } = useContext(PersistenceContext);
  const isInPast = isPastDate(date);

  const [{ isOver }, drop] = useDrop({
    accept: DND_IDS.TASK,
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
    hover: (item) => {
      if (isSameDay(item.dueDate, date)) return;

      moveTask(item.id, date);
      item.dueDate = date;
    },
  });

  return (
    <DayColumn
      date={date}
      tasks={tasks}
      ref={drop}
      blocked={isOver && isInPast}
      faded={isInPast}
    />
  );
};

export default DroppableDayColumn;
