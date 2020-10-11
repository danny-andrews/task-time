import Type from "union-type";
import { constantCase } from "constant-case";
import breakpoints from "../css/breakpoints.json";
import { mapObj } from "./util";
import { replace, pipe } from "ramda";

const transformVariable = pipe(replace(/--breakpoint-/, ""), constantCase);
const pxToInt = pipe(replace(/px/, ""), Number);
const transformBreakpoints = mapObj(transformVariable, pxToInt);

export const DND_IDS = {
  TASK: "TASK",
};

export const QUERY_IDS = {
  TASKS: "TASKS",
  DIFFICULTIES: "DIFFICULTIES",
};

export const Breakpoints = transformBreakpoints(
  breakpoints["environment-variables"]
);

export const Device = Type({
  Phone: [],
  Tablet: [],
  TabletLarge: [],
  Desktop: [],
  DesktopLarge: [],
});

export const DeviceFactory = (width) => {
  if (width >= Breakpoints.DESKTOP) {
    return Device.DesktopLarge;
  } else if (width >= Breakpoints.TABLET_LARGE) {
    return Device.Desktop;
  } else if (width >= Breakpoints.TABLET) {
    return Device.TabletLarge;
  } else if (width >= Breakpoints.PHONE) {
    return Device.Tablet;
  } else {
    return Device.Phone;
  }
};
