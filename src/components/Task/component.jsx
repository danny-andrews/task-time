import React from "react";
import taskFactory from "../Molecules/Task";
import { useBackend } from "../../hooks";
import { getTaskStaleness } from "../../shared/model";

const Task = ({ task }) => {
  const {
    isComplete,
    createdAt,
    text,
    isImportant,
    difficulty,
    originalDueDate,
    dueDate,
  } = task;
  const { toggleTask, refreshTask, deleteTask } = useBackend();
  const handleTaskClick = () => toggleTask(task);
  const handleRefreshClick = () => refreshTask(task);
  const handleDeleteClick = () => deleteTask(task.id);
  const handleEditClick = () => console.log("Implement edit functionality");

  const TaskComponent = taskFactory(dueDate, isComplete);

  const staleness = getTaskStaleness({ createdAt, originalDueDate });

  return (
    <TaskComponent
      isComplete={isComplete}
      staleness={staleness}
      text={text}
      isImportant={isImportant}
      difficulty={difficulty.value}
      onTaskClick={handleTaskClick}
      onRefreshClick={handleRefreshClick}
      onDeleteClick={handleDeleteClick}
      onEditClick={handleEditClick}
    />
  );
};

export default Task;
