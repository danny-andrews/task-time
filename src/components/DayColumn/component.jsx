import React, { useRef } from "react";
import cn from "classnames";
import { useDrop } from "react-dnd";
import { isToday, isEqual } from "date-fns";
import { isEmpty } from "ramda";
import TaskForm from "../TaskForm";
import Tasks from "../Tasks";
import styles from "./styles.module.css";
import { DND_IDS } from "../../shared/constants";
import { formatHumanReadable, isPastDate } from "../../shared/dates";
import { H, Disclosure } from "../Atoms";
import { useBackend } from "../../hooks";

const DayColumn = ({ date, tasks }) => {
  const { createTask, getDifficultyForTasks, moveTask } = useBackend();
  const isInPast = isPastDate(date);

  // DnD
  const [{ isOver }, drop] = useDrop({
    accept: DND_IDS.TASK,
    collect: (monitor) => {
      return {
        isOver: monitor.isOver({ shallow: true }),
      };
    },
    canDrop: () => isEmpty(tasks) && !isInPast,
    hover: (item) => {
      if (isEqual(item.dueDate, date)) return;

      moveTask(item.id, date);
      item.dueDate = date;
    },
  });

  // Template Vars
  const classes = cn(styles.root, { [styles["accent"]]: isToday(date) });
  const tasksSectionClasses = cn(styles["tasks-section"], {
    [styles["blocked"]]: isOver && isInPast,
  });
  const headerClasses = cn(styles.header, {
    [styles["faded"]]: isInPast,
  });
  const totalDifficulty = getDifficultyForTasks(tasks);
  const formRef = useRef(null);
  const handleDisplay = () => {
    formRef.current.focus();
  };
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
      <Disclosure buttonText="New Task" onDisplay={handleDisplay}>
        <TaskForm ref={formRef} onSubmit={handleSubmit} />
      </Disclosure>
    );
  };

  return (
    <li ref={drop} className={classes}>
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
};

export default DayColumn;
