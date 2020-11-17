import React, { useRef } from "react";
import cn from "classnames";
import { useDrop } from "react-dnd";
import { isToday, isEqual } from "date-fns";
import Tasks from "../Tasks";
import TaskForm from "../TaskForm";
import styles from "./styles.module.css";
import { DND_IDS } from "../../shared/constants";
import { formatHumanReadable, isPastDate } from "../../shared/dates";
import { H, Disclosure } from "../Atoms";
import { useBackend } from "../../hooks";

const DayColumn = ({ date, tasks }) => {
  const { createTask, moveTask, getDifficultyForTasks } = useBackend();

  // DnD
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: DND_IDS.TASK,
    drop: (item) => {
      moveTask(item.id, date);
    },
    canDrop: (item) => !isEqual(item.dueDate, date) && !isPastDate(date),
    collect: (monitor) => {
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
  });

  // Template Vars
  const isHovering = isOver && canDrop;
  const classes = cn(styles.root, { [styles["accent"]]: isToday(date) });
  const tasksSectionClasses = cn(styles["tasks-section"], {
    [styles["blocked"]]: isOver && isPastDate(date),
    [styles["faded"]]: isHovering,
  });
  const headerClasses = cn(styles.header, {
    [styles["faded"]]: isHovering || isPastDate(date),
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
