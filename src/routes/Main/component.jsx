import React from "react";
import { getTasksByDisplayDate } from "../../shared/model";
import DayGrid from "../../components/DayGrid";
import Header from "../../components/Header";
import { useBackend } from "../../hooks";

const Main = () => {
  const { useTasks } = useBackend();
  const { data = [] } = useTasks();
  const tasks = getTasksByDisplayDate(data);

  return (
    <>
      <Header />
      <DayGrid tasks={tasks} />
    </>
  );
};

export default Main;
