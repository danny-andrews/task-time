import * as R from "ramda";
import { parseISO } from "date-fns";
import flyd from "flyd";
import { serializeDate, isPastDate, median } from "../shared";
import { getTasksByDueDate, TaskModel } from "./model";
import useObservable from "../hooks/use-observable";

const DIFFICULTIES = [
  { id: "EASY", name: "easy", value: 1 },
  { id: "MEDIUM", name: "medium", value: 2 },
  { id: "HARD", name: "hard", value: 3 },
];

export default ({ backend, now = () => new Date() }) => {
  const get = R.curryN(2, ({ key, deserialize }, id) =>
    backend.get(key, id).map(deserialize)
  );

  const getAll = ({ key, deserialize }) =>
    backend.getAll(key).map(R.map(deserialize));

  const create = R.curryN(2, ({ key, serialize }, entity) => {
    const { id } = backend.create(key, serialize(entity));
    return { ...entity, id };
  });

  const updateWith = R.curryN(
    3,
    ({ key, serialize, deserialize }, id, updater) =>
      backend.update(key, id, R.pipe(deserialize, updater, serialize))
  );

  const update = R.curryN(3, (model, id, updates) =>
    updateWith(model, id, R.mergeLeft(updates))
  );

  const remove = R.curryN(2, ({ key }, id) => backend.remove(key, id));

  // Tasks
  const tasks = getAll(TaskModel);

  const tasksByDisplayDate = tasks.map(getTasksByDueDate);

  const updateTask = update(TaskModel);

  const updateTaskWith = updateWith(TaskModel);

  const getTask = get(TaskModel);

  const createTask = ({ text, dueDate, isImportant, difficulty, index }) =>
    create(TaskModel, {
      createdAt: now(),
      originalDueDate: dueDate,
      text,
      dueDate,
      isComplete: false,
      difficulty,
      isImportant,
      position: index + 1,
    });

  const deleteTask = remove(TaskModel);

  const rolloverOverdueTasks = R.map((task) => {
    if (!task.isComplete && isPastDate(task.dueDate, now())) {
      updateTask(task.id, { dueDate: now() });
    }

    return task;
  });
  flyd.on(rolloverOverdueTasks, tasks);

  const toggleTask = (id) =>
    updateTaskWith(id, (task) => ({ ...task, isComplete: !task.isComplete }));

  const refreshTask = (id) =>
    updateTaskWith(id, (task) => ({ ...task, originalDueDate: task.dueDate }));

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

  const moveTask = (id, newDueDate) => {
    const tasks = tasksByDisplayDate()[serializeDate(newDueDate)] || [];
    updateTask(id, {
      dueDate: newDueDate,
      position: tasks.length + 1,
    });
  };

  // Difficulties
  const getDifficulty = (id) =>
    DIFFICULTIES.find((difficulty) => difficulty.id === id);
  const getDifficulties = () => DIFFICULTIES;
  const getTotalDifficulty = R.pipe(
    R.map((task) => getDifficulty(task.difficulty).value),
    R.sum
  );

  const recommendedDifficulty = tasksByDisplayDate.map(
    R.pipe(
      R.toPairs,
      R.filter(([date]) => isPastDate(parseISO(date), now())),
      R.map(([, tasks]) => getTotalDifficulty(tasks)),
      (difficulties) =>
        difficulties.length > 0 ? Math.floor(median(difficulties)) : 6
    )
  );

  // Hooks
  const useRecommendedDifficulty = () =>
    useObservable([], recommendedDifficulty);

  const useTasksByDisplayDate = () => useObservable([], tasksByDisplayDate);

  return {
    // Difficulties
    getDifficulty,
    getDifficulties,
    getTotalDifficulty,
    // Tasks
    getTask,
    updateTask,
    deleteTask,
    createTask,
    toggleTask,
    refreshTask,
    moveTask,
    changeTaskPosition,
    // Custom Hooks.
    useTasksByDisplayDate,
    useRecommendedDifficulty,
    // Exposed for testing because I don't want to go through the rigamarole
    // required to test hooks.
    tasksByDisplayDate,
    tasks,
    recommendedDifficulty,
  };
};
