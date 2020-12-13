import * as R from "ramda";
import { parseISO } from "date-fns";
import { serializeDate, isPastDate, median } from "../shared";
import { getTasksByDueDate, TaskModel } from "./model";
import useObservable from "../hooks/use-observable";

const DIFFICULTIES = [
  { id: "EASY", name: "easy", value: 1 },
  { id: "MEDIUM", name: "medium", value: 2 },
  { id: "HARD", name: "hard", value: 3 },
];

export default (backend) => {
  const getEntities = ({ key, deserialize }) =>
    backend.getEntities(key).map(R.map(deserialize));

  const createEntity = R.curryN(2, ({ key, serialize }, entity) =>
    backend.createEntity(key, serialize(entity))
  );

  const updateEntity = R.curryN(2, ({ key, serialize }, id, updates) =>
    backend.updateEntity(key, id, serialize(updates))
  );

  const deleteEntity = R.curryN(2, ({ key }, id) =>
    backend.deleteEntity(key, id)
  );

  const getDifficulty = (id) =>
    DIFFICULTIES.find((difficulty) => difficulty.id === id);

  const getDifficulties = () => DIFFICULTIES;

  const updateTask = updateEntity(TaskModel);

  const rolloverOverdueTasks = R.map((task) => {
    if (!task.isComplete && isPastDate(task.dueDate)) {
      updateTask(task.id, { dueDate: new Date() });
    }

    return task;
  });

  const tasks = getEntities(TaskModel).map(rolloverOverdueTasks);

  const tasksByDisplayDate = tasks.map(getTasksByDueDate);

  const useTasksByDisplayDate = () => useObservable([], tasksByDisplayDate);

  const createTask = ({ text, dueDate, isImportant, difficulty, index }) =>
    createEntity(TaskModel, {
      createdAt: new Date(),
      originalDueDate: dueDate,
      text,
      dueDate: dueDate,
      isComplete: false,
      difficulty,
      isImportant,
      position: index + 1,
    });

  const deleteTask = deleteEntity(TaskModel);

  const toggleTask = (task) =>
    updateTask(task.id, { isComplete: !task.isComplete });

  const refreshTask = (task) =>
    updateTask(task.id, { originalDueDate: task.dueDate });

  const changeTaskPosition = ({ id, newDueDate, newIndex }) => {
    const tasks = tasksByDisplayDate()[serializeDate(newDueDate)];
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
              position: R.last(tasks).position + 1,
            },
          };

    updateTask(id, {
      position: (left.position + right.position) / 2,
      dueDate: newDueDate,
    });
  };

  const moveTask = ({ id, newDueDate, newIndex }) =>
    updateTask(id, {
      dueDate: newDueDate,
      position: newIndex + 1,
    });

  const getTotalDifficulty = R.pipe(
    R.map((task) => getDifficulty(task.difficulty).value),
    R.sum
  );

  const recommendedDifficulty = tasksByDisplayDate.map(
    R.pipe(
      R.toPairs,
      R.filter(([date]) => isPastDate(parseISO(date))),
      R.map(([, tasks]) => getTotalDifficulty(tasks)),
      (a) => (a.length > 0 ? Math.floor(median(a)) : 6)
    )
  );

  const useRecommendedDifficulty = () =>
    useObservable([], recommendedDifficulty);

  return {
    getTotalDifficulty,
    getDifficulties,
    getDifficulty,
    useRecommendedDifficulty,
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
