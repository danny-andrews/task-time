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
  const { toggleTask, refreshTask } = useBackend();
  const handleTaskClick = () => toggleTask(task);
  const handleRefreshClick = () => refreshTask(task);

  const TaskComponent = taskFactory(dueDate, isComplete);

  const staleness = getTaskStaleness({ createdAt, originalDueDate });

  return (
    <TaskComponent
      isComplete={isComplete}
      staleness={staleness}
      text={text}
      isImportant={isImportant}
      difficultyName={difficulty.name}
      onTaskClick={handleTaskClick}
      onRefreshClick={handleRefreshClick}
    />
  );
};

export default Task;
