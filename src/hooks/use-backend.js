import { useContext } from "react";
import * as R from "ramda";
import { BackendContext } from "../shared/contexts";
import { serializeDate } from "../shared/dates";
import { curry2, curry3 } from "../shared/util";
import { getTasksByDueDate, TaskModel } from "../shared/model";
import useObservable from "./use-observable";

const DIFFICULTIES = [
  { id: "EASY", name: "easy", value: 1 },
  { id: "MEDIUM", name: "medium", value: 2 },
  { id: "HARD", name: "hard", value: 3 },
];

export default () => {
  const backend = useContext(BackendContext);

  const getEntities = ({ key, deserialize }) =>
    backend.getEntities(key).map(R.map(deserialize));

  const createEntity = curry2(({ key, serialize }, entity) =>
    backend.createEntity(key, serialize(entity))
  );

  const updateEntity = curry3(({ key, serialize }, id, updates) =>
    backend.updateEntity(key, id, serialize(updates))
  );

  const deleteEntity = curry2(({ key }, id) => backend.deleteEntity(key, id));

  const getDifficulty = (id) =>
    DIFFICULTIES.find((difficulty) => difficulty.id === id);

  const getDifficulties = () => DIFFICULTIES;

  const getTasks = () => getEntities(TaskModel);

  const getTasksByDisplayDate = () => getTasks().map(getTasksByDueDate);

  const useTasks = () => useObservable([], getTasks());

  const useTasksByDisplayDate = () =>
    useObservable([], getTasksByDisplayDate());

  const createTask = ({ text, dueDate, isImportant, difficulty, position }) =>
    createEntity(TaskModel, {
      createdAt: Date.now(),
      originalDueDate: dueDate,
      text,
      dueDate: dueDate,
      isComplete: false,
      difficulty,
      isImportant,
      position: position + 1,
    });

  const updateTask = updateEntity(TaskModel);

  const deleteTask = deleteEntity(TaskModel);

  const toggleTask = (task) =>
    updateTask(task.id, { isComplete: !task.isComplete });

  const refreshTask = (task) =>
    updateTask(task.id, { originalDueDate: task.dueDate });

  const moveTask = (id, newDueDate) => updateTask(id, { dueDate: newDueDate });

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
                position: R.last(tasks).position,
              },
            };
      const newPosition = (left.position + right.position) / 2;

      updateTask(id, {
        position: newPosition,
        dueDate: newDueDate,
      });
    });
  };

  const getTotalDifficulty = R.pipe(
    R.map((task) => getDifficulty(task.difficulty).value),
    R.sum
  );

  return {
    getTotalDifficulty,
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
