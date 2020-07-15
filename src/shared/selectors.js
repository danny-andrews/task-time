import { parseISO, isBefore } from "date-fns";
import { assoc, append, propOr, reduce } from "ramda";
import { formatISODate } from "./util";

export const tasksByDisplayDate = reduce((acc, task) => {
  const currentDate = new Date();
  const dueDate = isBefore(parseISO(task.dueDate), currentDate)
    ? formatISODate(currentDate)
    : task.dueDate;

  return assoc(dueDate, append(task, propOr([], dueDate, acc)), acc);
}, {});
