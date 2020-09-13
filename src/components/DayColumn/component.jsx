import React, { useRef } from "react";
import cn from "classnames";
import { useDrop } from "react-dnd";
import { isPast, isToday } from "date-fns";
import Tasks from "../Tasks";
import TaskForm from "../TaskForm";
import styles from "./.module.css";
import { DND_IDS } from "../../shared/constants";
import {
  formatHumanReadable,
  serializeDate,
  isPastDate,
} from "../../shared/dates";
import { getDifficultyForTasks } from "../../shared/model";
import { H, Collapsable } from "../Atoms";
import { useBackend } from "../../hooks";

const DayColumn = ({ date, tasks }) => {
  const { updateTask, createTask } = useBackend();

  // Handlers
  const handleDrop = (id) => updateTask(id, { dueDate: serializeDate(date) });
  const handleSubmit = ({ important, ...rest }) =>
    createTask({
      ...rest,
      isImportant: important,
      dueDate: serializeDate(date),
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

  // Template Vars
  const isCurrentDay = isToday(date);
  const classes = cn(styles.root, {
    [styles["accent"]]: isCurrentDay,
    [styles["dnd-is-hovering"]]: !isPastDate(date) && isOver,
  });
  const tasksSectionClasses = cn(styles["tasks-section"], {
    [styles["blocked"]]: isOver && isPastDate(date),
  });
  const headerClasses = cn(styles.header, {
    [styles["strikethrough"]]: isPastDate(date),
  });
  const totalDifficulty = getDifficultyForTasks(tasks);
  const formRef = useRef(null);
  const handleDisplay = () => {
    formRef.current.focus();
  };
  const renderTaskForm = () => {
    if (isPastDate(date)) return null;

    return (
      <Collapsable buttonText="New Task" onDisplay={handleDisplay}>
        <TaskForm
          ref={formRef}
          className={styles.form}
          onSubmit={handleSubmit}
        />
      </Collapsable>
    );
  };

  return (
    <li ref={drop} className={classes}>
      <header className={headerClasses}>
        <H level={2} styleLevel={4}>
          {formatHumanReadable(date)}
        </H>
        <p>Total Difficulty: {totalDifficulty}</p>
      </header>
      <div className={tasksSectionClasses}>
        <Tasks tasks={tasks} date={date} />
        {renderTaskForm()}
      </div>
    </li>
  );
};

export default DayColumn;
