import React, { useRef, forwardRef, useContext } from "react";
import cn from "classnames";
import { useDrop } from "react-dnd";
import { isToday, isEqual } from "date-fns";
import TaskForm from "../TaskForm";
import Tasks from "../Tasks";
import styles from "./styles.module.css";
import { DND_IDS } from "../../shared/constants";
import { formatHumanReadable, isPastDate } from "../../shared/dates";
import { H, Disclosure } from "../Atoms";
import { PersistenceContext } from "../../shared/contexts";

const DayColumn = forwardRef(({ date, tasks, blocked, faded }, ref) => {
  const { createTask, getTotalDifficulty } = useContext(PersistenceContext);
  const isInPast = isPastDate(date);

  const classes = cn(styles.root, { [styles["accent"]]: isToday(date) });
  const tasksSectionClasses = cn(styles["tasks-section"], {
    [styles["blocked"]]: blocked,
  });
  const headerClasses = cn(styles.header, {
    [styles["faded"]]: faded,
  });
  const totalDifficulty = getTotalDifficulty(tasks);

  const renderTaskForm = () => {
    if (isInPast) return null;
    const formRef = useRef(null);
    const handleDisplay = () => {
      formRef.current.focus();
    };
    const handleSubmit = ({ important, ...rest }) =>
      createTask({
        ...rest,
        isImportant: important,
        dueDate: date,
        position: tasks.length,
      });

    return (
      <Disclosure buttonText="New Task" onDisplay={handleDisplay}>
        <TaskForm ref={formRef} onSubmit={handleSubmit} />
      </Disclosure>
    );
  };

  return (
    <li ref={ref} className={classes}>
      <header className={headerClasses}>
        <H level={2} styleLevel={4}>
          {formatHumanReadable(date)}
        </H>
        <p>
          Total Difficulty: <em>{totalDifficulty}</em>
        </p>
      </header>
      <div className={tasksSectionClasses}>
        <Tasks tasks={tasks} />
        {renderTaskForm()}
      </div>
    </li>
  );
});

const DroppableDayColumn = ({ date, tasks }) => {
  const { moveTask } = useContext(PersistenceContext);
  const isInPast = isPastDate(date);

  const [{ isOver }, drop] = useDrop({
    accept: DND_IDS.TASK,
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
    hover: (item) => {
      if (isEqual(item.dueDate, date)) return;

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
