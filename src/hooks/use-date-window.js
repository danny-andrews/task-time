import { useState } from "react";
import DateWindow from "../shared/date-window";

export default (windowSize) => {
  const [startDate, setStartDate] = useState(Date.now());
  const dateWindow = DateWindow(startDate, windowSize);

  const goToPrevDay = () => {
    setStartDate(dateWindow.decr().startDate);
  };
  const shiftBackward = () => {
    setStartDate(dateWindow.prev().startDate);
  };

  const goToNextDay = () => {
    setStartDate(dateWindow.incr().startDate);
  };
  const shiftForward = () => {
    setStartDate(dateWindow.next().startDate);
  };
  const goToDate = (date) => setStartDate(date);
  const goToCurrentDate = () => {
    setStartDate(Date.now());
  };

  return [
    dateWindow.dates,
    {
      goToPrevDay,
      shiftBackward,
      goToNextDay,
      shiftForward,
      goToCurrentDate,
      goToDate,
      dateWindow,
    },
  ];
};
