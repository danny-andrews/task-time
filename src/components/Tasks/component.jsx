import React from "react";
import Task from "../Task";
import styles from "./.module.css";
import { useBackend } from "../../hooks";
import { serializeDate } from "../../shared/dates";

const Tasks = ({ tasks, date }) => {
  const { updateTask, deleteTask } = useBackend();

  // Handlers
  const handleTaskClick = deleteTask;
  const handleRefreshClick = (id) =>
    updateTask(id, { originalDueDate: serializeDate(date) });

  return (
    <ol className={styles.root}>
      {tasks.map((task) => (
        <Task
          onTaskClick={handleTaskClick}
          onRefreshClick={handleRefreshClick}
          key={task.id}
          task={task}
        />
      ))}
    </ol>
  );
};

export default Tasks;
