import { parseISO, isBefore, differenceInDays } from "date-fns";
import { assoc, append, propOr, reduce, pipe, map, sum, path } from "ramda";
import { serializeDate } from "./dates";

export const getTasksByDisplayDate = reduce((acc, task) => {
  const currentDate = Date.now();
  const dueDate = isBefore(parseISO(task.dueDate), currentDate)
    ? serializeDate(currentDate)
    : task.dueDate;

  return assoc(dueDate, append(task, propOr([], dueDate, acc)), acc);
}, {});

export const getTasksForDates = (dates, tasks) =>
  dates.map((date) => ({
    date,
    tasks: propOr([], date, tasks),
  }));

export const getDifficultyForTasks = pipe(
  map(path(["difficulty", "value"])),
  sum
);

export const getTaskStaleness = ({ createdAt, originalDueDate }) =>
  differenceInDays(Date.now(), parseISO(createdAt)) -
  differenceInDays(parseISO(originalDueDate), parseISO(createdAt));
