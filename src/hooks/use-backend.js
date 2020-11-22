import { useContext } from "react";
import { parseISO } from "date-fns";
import { map, sum, pipe, reduce, assoc, append, propOr, last } from "ramda";
import { BackendContext } from "../shared/contexts";
import { serializeDate } from "../shared/dates";
import useObservable from "./use-observable";

const DIFFICULTIES = [
  { id: "EASY", name: "easy", value: 1 },
  { id: "MEDIUM", name: "medium", value: 2 },
  { id: "HARD", name: "hard", value: 3 },
];

const deserializeTask = (task) => ({
  ...task,
  createdAt: parseISO(task.createdAt),
  originalDueDate: parseISO(task.originalDueDate),
  dueDate: parseISO(task.dueDate),
});

const EntityTypes = {
  TASKS: {
    key: "tasks",
    deserialize: deserializeTask,
  },
};

const tasksByDisplayDate = pipe(
  reduce(
    (acc, task) =>
      assoc(
        serializeDate(task.dueDate),
        append(task, propOr([], serializeDate(task.dueDate), acc)),
        acc
      ),
    {}
  ),
  map((tasks) => tasks.sort((a, b) => a.position - b.position))
);

export default () => {
  const { getEntities, createEntity, updateEntity, deleteEntity } = useContext(
    BackendContext
  );

  const getDifficulty = (id) =>
    DIFFICULTIES.find((difficulty) => difficulty.id === id);

  const getDifficulties = () => DIFFICULTIES;

  const getEntities_ = ({ key, deserialize }) =>
    getEntities(key).map(map(deserialize));

  const getTasks = () => getEntities_(EntityTypes.TASKS);

  const getTasksByDisplayDate = () => getTasks().map(tasksByDisplayDate);

  const useTasks = () => useObservable([], getTasks());

  const useTasksByDisplayDate = () =>
    useObservable([], getTasksByDisplayDate());

  const createTask = ({ text, dueDate, isImportant, difficulty, position }) =>
    createEntity(EntityTypes.TASKS.key, {
      createdAt: serializeDate(Date.now()),
      originalDueDate: serializeDate(dueDate),
      text,
      dueDate: serializeDate(dueDate),
      isComplete: false,
      difficulty,
      isImportant,
      position: position + 1,
    });

  const updateTask = (id, updates) =>
    updateEntity(EntityTypes.TASKS.key, id, updates);

  const deleteTask = (id) => deleteEntity(EntityTypes.TASKS.key, id);

  const toggleTask = (task) =>
    updateTask(task.id, { isComplete: !task.isComplete });

  const refreshTask = (task) =>
    updateTask(task.id, {
      originalDueDate: serializeDate(task.dueDate),
    });

  const moveTask = (id, newDueDate) =>
    updateTask(id, { dueDate: serializeDate(newDueDate) });

  const toPromise = (observable) =>
    new Promise((resolve) => {
      observable.onValue(resolve);
    });

  const changeTaskPosition = ({ id, newDueDate, newIndex }) => {
    const dueDate = serializeDate(newDueDate);
    toPromise(getTasksByDisplayDate()).then((tasksByDate) => {
      const tasks = tasksByDate[dueDate];
      const oldIndex = tasks.findIndex((task) => task.id === id);
      const { left, right } =
        oldIndex > newIndex
          ? {
              left: tasks[newIndex - 1] || { position: 0 },
              right: tasks[newIndex],
            }
          : {
              left: tasks[newIndex],
              right: tasks[newIndex + 1] || {
                position: last(tasks).position,
              },
            };
      const newPosition = (left.position + right.position) / 2;

      updateTask(id, {
        position: newPosition,
        dueDate: serializeDate(newDueDate),
      });
    });
  };

  const getDifficultyForTasks = (tasks) => {
    return pipe(
      map((task) => getDifficulty(task.difficulty).value),
      sum
    )(tasks);
  };

  return {
    getDifficultyForTasks,
    getDifficulties,
    getDifficulty,
    useTasks,
    useTasksByDisplayDate,
    updateTask,
    deleteTask,
    createTask,
    toggleTask,
    refreshTask,
    moveTask,
    changeTaskPosition,
  };
};
