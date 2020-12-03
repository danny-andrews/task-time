import React, { useContext, useState } from "react";
import { getTaskStaleness } from "../../shared/model";
import {
  LockedTask,
  CompletedActiveTask,
  IncompleteTask,
  EditingTask,
} from "./component.jsx";
import { PersistenceContext } from "../../shared/contexts";
import { isPastDate } from "../../shared/dates";

// Factory for getting the proper task variation component for given task data.
const taskComponentFactory = ({ dueDate, isComplete, isEditing }) =>
  isEditing
    ? EditingTask
    : isPastDate(dueDate)
    ? LockedTask
    : isComplete
    ? CompletedActiveTask
    : IncompleteTask;

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
  const [isEditing, setIsEditing] = useState(false);
  const {
    toggleTask,
    refreshTask,
    deleteTask,
    getDifficulty,
    updateTask,
  } = useContext(PersistenceContext);
  const handleTaskClick = () => toggleTask(task);
  const handleRefreshClick = () => refreshTask(task);
  const handleDeleteClick = () => deleteTask(task.id);
  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleSave = ({ text }) => {
    setIsEditing(false);
    updateTask(task.id, { text });
  };

  const TaskComponent = taskComponentFactory({
    dueDate,
    isComplete,
    isEditing,
  });

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
      onSave={handleSave}
    />
  );
};

export default Task;
