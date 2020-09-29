import { useContext } from "react";
import { useQuery, queryCache } from "react-query";
import { QUERY_IDS } from "../shared/constants";
import { BackendContext } from "../shared/contexts";
import { serializeDate } from "../shared/dates";
import { parseISO } from "date-fns";
import { map } from "ramda";

const deserializeTasks = map((task) => ({
  ...task,
  createdAt: parseISO(task.createdAt),
  originalDueDate: parseISO(task.originalDueDate),
  dueDate: parseISO(task.dueDate),
}));

export default () => {
  const backend = useContext(BackendContext);

  const useDifficulties = () =>
    useQuery(QUERY_IDS.DIFFICULTIES, backend.getDifficulties, {
      cacheTime: Infinity,
    });

  const useTasks = () =>
    useQuery(QUERY_IDS.TASKS, () => backend.getTasks().then(deserializeTasks));

  const updateTask = (...args) =>
    backend.updateTask(...args).then(() => {
      queryCache.invalidateQueries(QUERY_IDS.TASKS);
    });

  const deleteTask = (...args) =>
    backend.deleteTask(...args).then(() => {
      queryCache.invalidateQueries(QUERY_IDS.TASKS);
    });

  const createTask = (...args) =>
    backend.createTask(...args).then(() => {
      queryCache.invalidateQueries(QUERY_IDS.TASKS);
    });

  const toggleTask = (task) =>
    updateTask(task.id, { isComplete: !task.isComplete });

  const refreshTask = (task) =>
    updateTask(task.id, { originalDueDate: serializeDate(task.dueDate) });

  const moveTask = (id, newDueDate) =>
    updateTask(id, { dueDate: serializeDate(newDueDate) });

  return {
    useDifficulties,
    useTasks,
    updateTask,
    deleteTask,
    createTask,
    toggleTask,
    refreshTask,
    moveTask,
  };
};
