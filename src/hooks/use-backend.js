import { useContext } from "react";
import { parseISO } from "date-fns";
import { map, sum, pipe, identity } from "ramda";
import { BackendContext } from "../shared/contexts";
import { serializeDate } from "../shared/dates";
import useObservable from "./use-observable";

const deserializeTask = (task) => ({
  ...task,
  createdAt: parseISO(task.createdAt),
  originalDueDate: parseISO(task.originalDueDate),
  dueDate: parseISO(task.dueDate),
});

const EntityTypes = {
  DIFFICULTIES: {
    key: "difficulties",
    deserialize: identity,
  },
  TASKS: {
    key: "tasks",
    deserialize: deserializeTask,
  },
};

export default () => {
  const {
    getEntities,
    getEntity,
    createEntity,
    updateEntity,
    deleteEntity,
  } = useContext(BackendContext);

  const getEntities_ = ({ key, deserialize }) =>
    getEntities(key).map(map(deserialize));

  const getDifficulties = () => getEntities_(EntityTypes.DIFFICULTIES);
  const getTasks = () => getEntities_(EntityTypes.TASKS);
  const getDifficulty = (id) => getEntity(EntityTypes.DIFFICULTIES.key, id);

  const useTasks = () => useObservable([], getTasks());

  const useDifficulties = () => useObservable([], getDifficulties());

  const createTask = ({ text, dueDate, isImportant, difficulty, position }) =>
    createEntity("tasks", {
      createdAt: serializeDate(Date.now()),
      originalDueDate: serializeDate(dueDate),
      text,
      dueDate: serializeDate(dueDate),
      isComplete: false,
      difficulty,
      isImportant,
      position,
    });

  const updateTask = (id, updates) => updateEntity("tasks", id, updates);

  const deleteTask = (id) => deleteEntity("tasks", id);

  const toggleTask = (task) =>
    updateTask(task.id, { isComplete: !task.isComplete });

  const refreshTask = (task) =>
    updateTask(task.id, {
      originalDueDate: serializeDate(task.dueDate),
    });

  const moveTask = (id, newDueDate) =>
    updateTask(id, { dueDate: serializeDate(newDueDate) });

  const getDifficultyForTasks = pipe(
    map((task) => getDifficulty(task.difficulty).value),
    sum
  );

  return {
    getDifficultyForTasks,
    getDifficulties,
    getDifficulty,
    useTasks,
    useDifficulties,
    updateTask,
    deleteTask,
    createTask,
    toggleTask,
    refreshTask,
    moveTask,
  };
};
