import { DeviceFactory } from "../shared/constants";
import useWindowSize from "./use-window-size";

export default () => {
  const { width } = useWindowSize();

  return DeviceFactory(width);
};
