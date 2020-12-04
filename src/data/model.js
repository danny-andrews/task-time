import { differenceInDays, parseISO } from "date-fns";
import * as R from "ramda";
import { serializeDate } from "../shared";

const DATE_FIELDS = new Set(["createdAt", "originalDueDate", "dueDate"]);
export const TaskModel = {
  key: "tasks",
  deserialize: R.mapObjIndexed((value, field) => {
    if (DATE_FIELDS.has(field)) {
      return parseISO(value);
    }

    return value;
  }),
  serialize: R.mapObjIndexed((value, field) => {
    if (DATE_FIELDS.has(field)) {
      return serializeDate(value);
    }

    return value;
  }),
};

export const sortTasks = R.sort((a, b) => a.position - b.position);

export const getTasksByDueDate = R.pipe(
  R.reduce(
    (acc, task) =>
      R.over(
        R.lensPath([serializeDate(task.dueDate)]),
        (tasks = []) => R.append(task, tasks),
        acc
      ),
    {}
  ),
  R.map(sortTasks)
);

export const getTasksForDates = (dates, tasks) =>
  dates.map((date) => ({
    date,
    tasks: R.propOr([], serializeDate(date), tasks),
  }));

export const getTaskStaleness = ({ createdAt, originalDueDate }) =>
  differenceInDays(Date.now(), createdAt) -
  differenceInDays(originalDueDate, createdAt);
