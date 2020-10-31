import React, { useRef } from "react";
import cn from "classnames";
import { useDrop } from "react-dnd";
import { isToday } from "date-fns";
import Tasks from "../Tasks";
import TaskForm from "../TaskForm";
import styles from "./styles.module.css";
import { DND_IDS } from "../../shared/constants";
import { formatHumanReadable, isPastDate } from "../../shared/dates";
import { H, Disclosure } from "../Atoms";
import { useBackend } from "../../hooks";

const DayColumn = ({ date, tasks }) => {
  const { createTask, moveTask, getDifficultyForTasks } = useBackend();

  // Handlers
  const handleDrop = (id) => {
    if (isPastDate(date)) return;

    moveTask(id, date);
  };
  const handleSubmit = ({ important, ...rest }) =>
    createTask({
      ...rest,
      isImportant: important,
      dueDate: date,
      position: tasks.length,
    });

  // DnD
  const [{ isOver }, drop] = useDrop({
    accept: DND_IDS.TASK,
    drop: (item) => {
      handleDrop(item.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  const isHovering = !isPastDate(date) && isOver;

  // Template Vars
  const isCurrentDay = isToday(date);
  const classes = cn(styles.root, { [styles["accent"]]: isCurrentDay });
  const tasksSectionClasses = cn(styles["tasks-section"], {
    [styles["blocked"]]: isOver && isPastDate(date),
    [styles["dnd-is-hovering"]]: isHovering,
  });
  const headerClasses = cn(styles.header, {
    [styles["in-past"]]: isPastDate(date),
    [styles["dnd-is-hovering"]]: isHovering,
    [styles["accent"]]: isCurrentDay,
  });
  const totalDifficulty = getDifficultyForTasks(tasks);
  const formRef = useRef(null);
  const handleDisplay = () => {
    formRef.current.focus();
  };
  const renderTaskForm = () => {
    if (isPastDate(date)) return null;

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
          Challenge Level: <em>{totalDifficulty}</em>
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
