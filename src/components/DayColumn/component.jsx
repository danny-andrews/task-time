import React, { useContext } from "react";
import cn from "classnames";
import { useDrop } from "react-dnd";
import Task from "../Task";
import TaskForm from "../TaskForm";
import styles from "./.module.css";
import { DND_IDS } from "../../shared/constants";
import {
  isToday,
  formatDate,
  calculateTotalDifficulty,
} from "../../shared/util";
import { BackendContext } from "../../shared/contexts";
import { H, Collapsable } from "../Atoms";

const DayColumn = ({ date, tasks }) => {
  const backend = useContext(BackendContext);

  const moveTask = (id, newDueDate) =>
    backend.updateTask(id, { dueDate: newDueDate });

  const completeTask = backend.deleteTask;
  const refreshTask = (id) => backend.updateTask(id, { originalDueDate: date });
  const addTask = ({ important, ...rest }) =>
    backend.createTask({
      ...rest,
      isImportant: important,
      dueDate: date,
    });

  const [{ isOver }, drop] = useDrop({
    accept: DND_IDS.TASK,
    drop: (item) => {
      moveTask(item.id, date);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const className = cn(styles.root, {
    [styles["current-date"]]: isToday(date),
    [styles["is-over"]]: isOver,
  });

  return (
    <li ref={drop} className={className}>
      <header className={styles.header}>
        <H styleLevel={4}>{formatDate(date)}</H>
        <p>Total Difficulty: {calculateTotalDifficulty(tasks)}</p>
      </header>
      <div className={styles["tasks-section"]}>
        <ol className={styles.tasks}>
          {tasks.map((task) => (
            <Task
              onTaskClick={completeTask}
              onRefreshClick={refreshTask}
              key={task.id}
              task={task}
            />
          ))}
        </ol>
        <Collapsable buttonText="New Task">
          <div className={styles["form-container"]}>
            <TaskForm onSubmit={addTask} />
          </div>
        </Collapsable>
      </div>
    </li>
  );
};

export default DayColumn;
