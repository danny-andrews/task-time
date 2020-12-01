import React, { useContext } from "react";
import { getTaskStaleness } from "../../shared/model";
import taskComponentFactory from "./component.jsx";
import { PersistenceContext } from "../../shared/contexts";

const Task = ({ task, className }) => {
  const {
    isComplete,
    createdAt,
    text,
    isImportant,
    difficulty: difficultyId,
    originalDueDate,
    dueDate,
  } = task;
  const { toggleTask, refreshTask, deleteTask, getDifficulty } = useContext(
    PersistenceContext
  );
  const handleTaskClick = () => toggleTask(task);
  const handleRefreshClick = () => refreshTask(task);
  const handleDeleteClick = () => deleteTask(task.id);
  const handleEditClick = () => console.log("Implement edit functionality");

  const TaskComponent = taskComponentFactory(dueDate, isComplete);

  const staleness = getTaskStaleness({ createdAt, originalDueDate });
  const difficulty = getDifficulty(difficultyId).value;

  return (
    <TaskComponent
      className={className}
      isComplete={isComplete}
      staleness={staleness}
      text={text}
      isImportant={isImportant}
      difficulty={difficulty}
      onTaskClick={handleTaskClick}
      onRefreshClick={handleRefreshClick}
      onDeleteClick={handleDeleteClick}
      onEditClick={handleEditClick}
    />
  );
};

export default Task;
