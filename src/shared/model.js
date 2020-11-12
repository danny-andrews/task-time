import { differenceInDays } from "date-fns";
import { assoc, append, propOr, reduce } from "ramda";
import { serializeDate } from "./dates";

export const getTasksByDisplayDate = reduce(
  (acc, task) =>
    assoc(
      serializeDate(task.dueDate),
      append(task, propOr([], serializeDate(task.dueDate), acc)),
      acc
    ),
  {}
);

export const getTasksForDates = (dates, tasks) =>
  dates.map((date) => ({
    date,
    tasks: propOr([], date, tasks),
  }));

export const getTaskStaleness = ({ createdAt, originalDueDate }) =>
  differenceInDays(Date.now(), createdAt) -
  differenceInDays(originalDueDate, createdAt);
