import DateWindow from "../date-window";
import { parseISO } from "date-fns";

it("runs", () => {
  const dateWindow = DateWindow(parseISO("2020-07-17"), 3);
  expect(dateWindow.dates).toEqual(["2020-07-17", "2020-07-18", "2020-07-19"]);
});

it("shiftForward shifts date range forward by `size`", () => {
  const dateWindow = DateWindow(parseISO("2020-07-17"), 3);
  expect(dateWindow.shiftForward().dates).toEqual([
    "2020-07-20",
    "2020-07-21",
    "2020-07-22",
  ]);
});

it("shiftForward1 shifts date range forward by 1", () => {
  const dateWindow = DateWindow(parseISO("2020-07-17"), 3);
  expect(dateWindow.shiftForward1().dates).toEqual([
    "2020-07-18",
    "2020-07-19",
    "2020-07-20",
  ]);
});

it("shiftBackward shifts date range backward by `size`", () => {
  const dateWindow = DateWindow(parseISO("2020-07-17"), 3);
  expect(dateWindow.shiftBackward().dates).toEqual([
    "2020-07-14",
    "2020-07-15",
    "2020-07-16",
  ]);
});

it("shiftForward1 shifts date range backward by 1", () => {
  const dateWindow = DateWindow(parseISO("2020-07-17"), 3);
  expect(dateWindow.shiftBackward1().dates).toEqual([
    "2020-07-16",
    "2020-07-17",
    "2020-07-18",
  ]);
});
