import DateWindow from "../date-window";
import { serializeDate } from "../date";
import { parseISO } from "date-fns";
import t from "tap";

t.test(
  "returns range of dates of length n starting at a given date",
  async (is) => {
    const dateWindow = DateWindow(parseISO("2020-07-17"), 3);
    is.same(dateWindow.dates.map(serializeDate), [
      "2020-07-17",
      "2020-07-18",
      "2020-07-19",
    ]);
  }
);

t.test("next shifts date range forward by `size`", async (is) => {
  const dateWindow = DateWindow(parseISO("2020-07-17"), 3);
  is.same(dateWindow.next().dates.map(serializeDate), [
    "2020-07-20",
    "2020-07-21",
    "2020-07-22",
  ]);
});

t.test("incr shifts date range forward by 1", async (is) => {
  const dateWindow = DateWindow(parseISO("2020-07-17"), 3);
  is.same(dateWindow.incr().dates.map(serializeDate), [
    "2020-07-18",
    "2020-07-19",
    "2020-07-20",
  ]);
});

t.test("prev shifts date range backward by `size`", async (is) => {
  const dateWindow = DateWindow(parseISO("2020-07-17"), 3);
  is.same(dateWindow.prev().dates.map(serializeDate), [
    "2020-07-14",
    "2020-07-15",
    "2020-07-16",
  ]);
});

t.test("decr shifts date range backward by 1", async (is) => {
  const dateWindow = DateWindow(parseISO("2020-07-17"), 3);
  is.same(dateWindow.decr().dates.map(serializeDate), [
    "2020-07-16",
    "2020-07-17",
    "2020-07-18",
  ]);
});
