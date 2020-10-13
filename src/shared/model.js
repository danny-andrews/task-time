import { differenceInDays } from "date-fns";
import {
  assoc,
  append,
  propOr,
  reduce,
  pipe,
  map,
  sum,
  path,
  prop,
} from "ramda";
import { serializeDate } from "./dates";
import { toObjBy } from "./util";

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

export const getDifficultyForTasks = pipe(
  map(path(["difficulty", "value"])),
  sum
);

export const getTaskStaleness = ({ createdAt, originalDueDate }) =>
  differenceInDays(Date.now(), createdAt) -
  differenceInDays(originalDueDate, createdAt);

export const normalizeModels = toObjBy(prop("id"));
