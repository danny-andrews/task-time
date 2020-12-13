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

const Header = ({ date, difficulty }) => {
  return (
    <header
      className={cn(styles.header, {
        [styles["faded"]]: isPastDate(date),
        [styles["accent"]]: isToday(date),
      })}
    >
      <H level={2} styleLevel={4}>
        {formatHumanReadable(date)}
      </H>
      <p>
        Difficulty: <em>{difficulty}</em>
      </p>
    </header>
  );
};

const DayColumn = forwardRef(({ date, tasks, blocked }, ref) => {
  const { createTask, getTotalDifficulty } = useContext(PersistenceContext);
  const isInPast = isPastDate(date);

  const renderTaskForm = () => {
    if (isPastDate(date)) return null;

    const handleSubmit = ({ important, ...rest }) =>
      createTask({
        ...rest,
        isImportant: important,
        dueDate: date,
        index: tasks.length,
      });

    return (
      <Disclosure buttonText="New Task" className={styles.disclosure}>
        <TaskForm onSubmit={handleSubmit} />
      </Disclosure>
    );
  };

  return (
    <li ref={ref} className={styles.root}>
      <Header date={date} difficulty={getTotalDifficulty(tasks)} />
      <Tasks isInPast={isInPast} isBlocked={blocked} tasks={tasks} />
      {renderTaskForm()}
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

      moveTask({ id: item.id, newDueDate: date, newIndex: tasks.length });
      item.dueDate = date;
    },
  });

  return (
    <DayColumn
      date={date}
      tasks={tasks}
      ref={drop}
      blocked={isOver && isInPast}
    />
  );
};

export default DroppableDayColumn;
