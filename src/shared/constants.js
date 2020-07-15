import Type from "union-type";

export const Difficulties = {
  EASY: {
    id: "EASY",
    name: "easy",
    value: 1,
  },
  MEDIUM: {
    id: "MEDIUM",
    name: "medium",
    value: 2,
  },
  HARD: {
    id: "HARD",
    name: "hard",
    value: 3,
  },
};

export const DND_IDS = {
  TASK: "TASK",
};

export const QUERY_IDS = {
  TASKS: "TASKS",
};

export const Breakpoints = {
  PHONE: 600,
  TABLET: 900,
  DESKTOP: 1200,
  DESKTOP_LARGE: 1800,
};

export const Device = Type({
  Phone: [],
  Tablet: [],
  Desktop: [],
  DesktopLarge: [],
});

export const DeviceFactory = (width) => {
  if (width >= Breakpoints.DESKTOP_LARGE) {
    return Device.DesktopLarge;
  } else if (width >= Breakpoints.DESKTOP) {
    return Device.Desktop;
  } else if (width >= Breakpoints.TABLET) {
    return Device.Tablet;
  } else {
    return Device.Phone;
  }
};
