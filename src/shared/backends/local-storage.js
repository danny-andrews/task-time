import { v4 as uuidv4 } from "uuid";
import { assoc, merge, omit } from "ramda";
import { serializeDate } from "../dates";

const LocalStorage = () => {
  const getItem = (key) => JSON.parse(window.localStorage.getItem(key));
  const setItem = (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value));
  };
  const updateItem = (key, updater) => setItem(key, updater(getItem(key)));

  return { getItem, setItem, updateItem };
};

const difficulties = {
  EASY: { id: "EASY", name: "easy", value: 1 },
  MEDIUM: { id: "MEDIUM", name: "medium", value: 2 },
  HARD: { id: "HARD", name: "hard", value: 3 },
};

export default () => {
  const localStorage = LocalStorage();
  const TASKS = "tasks";
  const DIFFICULTIES = "difficulties";
  localStorage.setItem(DIFFICULTIES, difficulties);

  const getDifficulties = () =>
    Promise.resolve(Object.values(localStorage.getItem(DIFFICULTIES)));

  const expandDifficulty = (task) =>
    getDifficulties().then((difficulties) => ({
      ...task,
      difficulty: difficulties.find(
        (difficulty) => difficulty.id === task.difficulty
      ),
    }));

  const getTasks = () =>
    Promise.resolve(Object.values(localStorage.getItem(TASKS))).then((tasks) =>
      Promise.all(tasks.map(expandDifficulty))
    );

  const createTask = ({ text, dueDate, isImportant, difficulty }) => {
    const id = uuidv4();
    const newTask = {
      id,
      originalDueDate: dueDate,
      createdAt: serializeDate(new Date()),
      text,
      dueDate,
      difficulty,
      isImportant,
    };
    localStorage.updateItem(TASKS, assoc(id, newTask));

    return Promise.resolve();
  };

  const deleteTask = (id) => {
    localStorage.updateItem(TASKS, omit([id]));

    return Promise.resolve();
  };

  const updateTask = (id, updates) => {
    localStorage.updateItem(TASKS, (tasks) =>
      assoc(id, merge(tasks[id], updates), tasks)
    );

    return Promise.resolve();
  };

  return { getTasks, createTask, updateTask, deleteTask, getDifficulties };
};
