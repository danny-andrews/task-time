import { range } from "ramda";
import { addDays, subDays } from "date-fns";
import { formatISODate } from "./util";

const DateWindow = (startDate, size) => {
  const dates = range(0, size).map((i) => formatISODate(addDays(startDate, i)));

  const nextN = (n) => DateWindow(addDays(startDate, n), size);
  const next = () => nextN(size);
  const incr = () => nextN(1);

  const prevN = (n) => DateWindow(subDays(startDate, n), size);
  const prev = () => prevN(size);
  const decr = () => prevN(1);

  return { startDate, dates, next, prev, incr, decr };
};

export default DateWindow;
