import React from "react";
import { useBackend } from "../../hooks";
import { getTaskStaleness } from "../../shared/model";
import taskFactory from "./component.jsx";

const Task = ({ task }) => {
  const {
    isComplete,
    createdAt,
    text,
    isImportant,
    difficulty: difficultyId,
    originalDueDate,
    dueDate,
  } = task;
  const { toggleTask, refreshTask, deleteTask, getDifficulty } = useBackend();
  const handleTaskClick = () => toggleTask(task);
  const handleRefreshClick = () => refreshTask(task);
  const handleDeleteClick = () => deleteTask(task.id);
  const handleEditClick = () => console.log("Implement edit functionality");

  const TaskComponent = taskFactory(dueDate, isComplete);

  const staleness = getTaskStaleness({ createdAt, originalDueDate });
  const difficulty = getDifficulty(difficultyId);

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
