import { v4 as uuidv4 } from "uuid";
import { queryCache } from "react-query";
import { assoc, merge, omit } from "ramda";
import { formatISODate } from "../util";
import { Difficulties } from "../constants";

const LocalStorage = () => {
  const getItem = (key) => JSON.parse(window.localStorage.getItem(key));
  const setItem = (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value));
  };
  const updateItem = (key, updater) => setItem(key, updater(getItem(key)));

  return { getItem, setItem, updateItem };
};

export default () => {
  const localStorage = LocalStorage();
  const TASKS = "tasks";

  const expandDifficulty = (task) => ({
    ...task,
    difficulty: Difficulties[task.difficulty],
  });

  const getTasks = () =>
    Promise.resolve(
      Object.values(localStorage.getItem(TASKS)).map(expandDifficulty)
    );

  const createTask = ({ text, dueDate, isImportant, difficulty }) => {
    const id = uuidv4();
    const newTask = {
      id,
      originalDueDate: dueDate,
      createdAt: formatISODate(new Date()),
      text,
      dueDate,
      difficulty,
      isImportant,
    };
    localStorage.updateItem(TASKS, assoc(id, newTask));
    queryCache.invalidateQueries("tasks");

    return Promise.resolve();
  };

  const deleteTask = (id) => {
    localStorage.updateItem(TASKS, omit([id]));

    queryCache.invalidateQueries("tasks");

    return Promise.resolve();
  };

  const updateTask = (id, updates) => {
    localStorage.updateItem(TASKS, (tasks) =>
      assoc(id, merge(tasks[id], updates), tasks)
    );

    queryCache.invalidateQueries("tasks");

    return Promise.resolve();
  };

  return { getTasks, createTask, updateTask, deleteTask };
};
