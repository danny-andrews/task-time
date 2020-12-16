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
import { H, Disclosure, SquareButton } from "../Atoms";

const Header = ({ date, difficulty, onSyncClick }) => {
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
        Difficulty: <em>{difficulty}</em>{" "}
        <SquareButton onClick={onSyncClick}>Sync</SquareButton>
      </p>
    </header>
  );
};

const DayColumn = forwardRef(({ date, tasks, blocked }, ref) => {
  const { createTask, getTotalDifficulty, sortTasksInDay } = useContext(
    PersistenceContext
  );
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
  const handleSyncClick = () => {
    sortTasksInDay(date);
  };

  return (
    <li ref={ref} className={styles.root}>
      <Header
        date={date}
        difficulty={getTotalDifficulty(tasks)}
        onSyncClick={handleSyncClick}
      />
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
    />
  );
};

export default DroppableDayColumn;
