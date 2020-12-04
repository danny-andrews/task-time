import * as R from "ramda";
import { addDays, subDays } from "date-fns";

const DateWindow = (startDate, size) => {
  const dates = R.range(0, size).map((i) => addDays(startDate, i));

  const nextN = (n) => DateWindow(addDays(startDate, n), size);
  const next = () => nextN(size);
  const incr = () => nextN(1);

  const prevN = (n) => DateWindow(subDays(startDate, n), size);
  const prev = () => prevN(size);
  const decr = () => prevN(1);

  return { startDate, dates, next, prev, incr, decr };
};

export default DateWindow;
