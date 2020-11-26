import Type from "union-type";
import { constantCase } from "constant-case";
import * as R from "ramda";
import useWindowSize from "./use-window-size";
import { mapObj } from "../shared/util";
import breakpoints from "../css/breakpoints.json";

const transformVariable = R.pipe(R.replace(/--breakpoint-/, ""), constantCase);
const pxToInt = R.pipe(R.replace(/px/, ""), Number);
const transformBreakpoints = mapObj(transformVariable, pxToInt);
const Breakpoints = transformBreakpoints(breakpoints["environment-variables"]);

const Device = Type({
  Phone: [],
  Tablet: [],
  TabletLarge: [],
  Desktop: [],
  DesktopLarge: [],
});

const DeviceFactory = (width) => {
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

export default () => {
  const { width } = useWindowSize();

  return DeviceFactory(width);
};
