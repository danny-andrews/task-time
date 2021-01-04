import * as R from "ramda";
import { parseISO, isSameDay, addDays } from "date-fns";
import flyd from "flyd";
import { serializeDate, isPastDate, median } from "../shared";
import { getTasksByDueDate, TaskModel, getTaskStaleness } from "./model";
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
    updateWith(model, id, R.always(updates))
  );

  const remove = R.curryN(2, ({ key }, id) => backend.remove(key, id));

  // Tasks
  const tasks = getAll(TaskModel);

  const tasksByDisplayDate = tasks.map(getTasksByDueDate);

  const getTasksForDueDate = (dueDate) =>
    tasksByDisplayDate()[serializeDate(dueDate)] || [];

  const updateTask = update(TaskModel);

  const updateTaskWith = updateWith(TaskModel);

  const getTask = get(TaskModel);

  const createTask = ({ text, dueDate, isImportant, difficulty }) =>
    create(TaskModel, {
      createdAt: now(),
      originalDueDate: dueDate,
      text,
      dueDate,
      isComplete: false,
      difficulty,
      isImportant,
      position: getTasksForDueDate(dueDate).length + 1,
    });

  const deleteTask = remove(TaskModel);

  const getOverdueTasks = R.filter(
    (task) => !task.isComplete && isPastDate(task.dueDate, now())
  );

  const rolloverOverdueTasks = R.pipe(getOverdueTasks, (tasks) => {
    backend.transact(() => {
      tasks.forEach((task) => {
        updateTask(task.id, { dueDate: now() });
      });
    });
  });

  flyd.on(rolloverOverdueTasks, tasks);

  const toggleTask = (id) =>
    updateTaskWith(id, (task) => ({ isComplete: !task.isComplete }));

  const refreshTask = (id) =>
    updateTaskWith(id, (task) => ({ originalDueDate: task.dueDate }));

  const changeTaskPosition = ({ id, newDueDate, newIndex }) => {
    const tasks = tasksByDisplayDate()[serializeDate(newDueDate)] || [
      { position: 0 },
    ];
    const oldIndex = tasks.findIndex((task) => task.id === id);
    if (oldIndex === newIndex) return;

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
    updateTask(id, {
      dueDate: newDueDate,
      position: getTasksForDueDate(newDueDate).length + 1,
    });
  };

  // Difficulties
  const getDifficulty = (id) =>
    DIFFICULTIES.find((difficulty) => difficulty.id === id);

  const getTaskDifficulty = R.pipe(
    R.prop("difficulty"),
    getDifficulty,
    R.prop("value")
  );

  const getDifficulties = () => DIFFICULTIES;

  const getTotalDifficulty = R.pipe(R.map(getTaskDifficulty), R.sum);

  const recommendedDifficulty = tasksByDisplayDate.map(
    R.pipe(
      R.toPairs,
      R.filter(([date]) => isPastDate(parseISO(date), now())),
      R.map(([, tasks]) => getTotalDifficulty(tasks)),
      (difficulties) => (R.isEmpty(difficulties) ? [0] : difficulties),
      median,
      Math.floor,
      R.max(3)
    )
  );

  // This is a little cheeky, but I like how concise it is.
  const byIsImportant = R.descend(R.prop("isImportant"));
  const byDifficulty = R.descend(getTaskDifficulty);
  const byStaleness = R.descend(getTaskStaleness);
  const byIsComplete = R.ascend(R.prop("isComplete"));

  const taskSort = R.sortWith([
    byIsComplete,
    byIsImportant,
    byDifficulty,
    byStaleness,
  ]);

  const setPositions = (tasks) => {
    backend.transact(() => {
      tasks.forEach(({ id, dueDate }, i) => {
        changeTaskPosition({
          id,
          newDueDate: dueDate,
          newIndex: i,
        });
      });
    });
  };

  const sortTasksInDay = R.pipe(getTasksForDueDate, taskSort, setPositions);

  const partitionTasksByCompletion = R.partition((task) => task.isComplete);

  const getPartitionedTasks3 = (dueDate, tasks, maxDifficulty) => {
    if (R.isEmpty(tasks)) return [];
    const [completeTasks, incompleteTasks] = partitionTasksByCompletion(tasks);

    let currentDifficulty = getTotalDifficulty(completeTasks);
    let thisDaysTasks = [];
    let nextDaysTasks = [];
    incompleteTasks.forEach((task) => {
      const difficulty = getTaskDifficulty(task);
      if (difficulty + currentDifficulty <= maxDifficulty) {
        thisDaysTasks = R.append(task, thisDaysTasks);
        currentDifficulty += difficulty;
      } else {
        nextDaysTasks = R.append(task, nextDaysTasks);
      }
    });

    const nextDate = addDays(dueDate, 1);
    const nextTasks = [...getTasksForDueDate(nextDate), ...nextDaysTasks];

    return [
      [dueDate, [...thisDaysTasks, ...completeTasks]],
      ...getPartitionedTasks3(nextDate, nextTasks, maxDifficulty),
    ];
  };

  const getPartitionedTasks = (dueDate) =>
    getPartitionedTasks3(
      dueDate,
      getTasksForDueDate(dueDate),
      recommendedDifficulty()
    );

  const partitionTasks = (dueDate) => {
    backend.transact(() => {
      getPartitionedTasks(dueDate).forEach(([dueDate, tasks]) => {
        tasks.forEach((task) => {
          if (!isSameDay(task.dueDate, dueDate)) {
            moveTask(task.id, dueDate);
          }
        });
      });
    });
  };

  // Hooks
  const useRecommendedDifficulty = () =>
    useObservable([], recommendedDifficulty);

  const useTasksByDisplayDate = () => useObservable([], tasksByDisplayDate);

  return {
    // Difficulties
    getTaskDifficulty,
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
    sortTasksInDay,
    partitionTasks,
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
