import { parseISO } from "date-fns";
import { assoc, toPairs } from "ramda";
import { serializeDate, isPastDate } from "../../dates";
import DB from "./db";
import seedData from "./seed-data";
import { TASKS, DIFFICULTIES } from "./constants";
import { normalizeModels } from "../../model";

export default () => {
  const { create, retrieveAll, update, remove, seed } = DB();

  // Seed "db"
  toPairs(seedData).forEach(([entityName, entities]) =>
    seed(entityName, entities)
  );

  // Helpers
  const updateDueDates = (tasks) =>
    Promise.all(
      tasks.map((task) => {
        const currentDate = Date.now();
        const currentDueDate = parseISO(task.dueDate);
        if (isPastDate(currentDueDate) && !task.isComplete) {
          return updateTask(task.id, { dueDate: serializeDate(currentDate) });
        }

        return Promise.resolve(task);
      })
    );

  const expandDifficulties = (tasks) =>
    retrieveAll(DIFFICULTIES).then((difficulties) => {
      const difficultyMap = normalizeModels(difficulties);

      return tasks.map((task) =>
        assoc("difficulty", difficultyMap[task.difficulty], task)
      );
    });

  // Meat and potatoes
  const getDifficulties = () => retrieveAll(DIFFICULTIES);

  const getTasks = () =>
    retrieveAll(TASKS).then(updateDueDates).then(expandDifficulties);

  const createTask = ({ text, dueDate, isImportant, difficulty }) =>
    create(TASKS, {
      originalDueDate: serializeDate(dueDate),
      text,
      dueDate: serializeDate(dueDate),
      isComplete: false,
      difficulty,
      isImportant,
    });

  const updateTask = (id, updates) => update(TASKS, id, updates);

  const deleteTask = (id) => remove(TASKS, id);

  return { getDifficulties, getTasks, createTask, updateTask, deleteTask };
};
