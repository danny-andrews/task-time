import React, { useContext, useState } from "react";
import { getTaskStaleness } from "../../data/model";
import {
  LockedTask,
  CompletedActiveTask,
  IncompleteTask,
  EditingTask,
} from "./component.jsx";
import { PersistenceContext, isPastDate } from "../../shared";

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
  const { id, isComplete, text, isImportant, originalDueDate, dueDate } = task;
  const [isEditing, setIsEditing] = useState(false);
  const {
    toggleTask,
    refreshTask,
    deleteTask,
    getTaskDifficulty,
    updateTask,
  } = useContext(PersistenceContext);
  const handleTaskClick = () => toggleTask(id);
  const handleRefreshClick = () => refreshTask(id);
  const handleDeleteClick = () => deleteTask(id);
  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleSave = ({ text }) => {
    setIsEditing(false);
    updateTask(id, { text: text.trim() });
  };

  const TaskComponent = taskComponentFactory({
    dueDate,
    isComplete,
    isEditing,
  });

  const staleness = getTaskStaleness({ dueDate, originalDueDate });
  const difficulty = getTaskDifficulty(task);

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
