import React, { forwardRef, useContext } from "react";
import { useDrop } from "react-dnd";
import { isSameDay } from "date-fns";
import TaskForm from "../TaskForm";
import Tasks from "../Tasks";
import styles from "./styles.module.css";
import { DND_IDS, isPastDate, PersistenceContext } from "../../shared";
import { Disclosure } from "../Atoms";
import DayColumnHeader from "./DayColumnHeader";

const DayColumn = forwardRef(({ date, tasks, blocked }, ref) => {
  const { createTask, getTotalDifficulty, sortTasksInDay } = useContext(
    PersistenceContext
  );
  const isInPast = isPastDate(date);

  const renderTaskForm = () => {
    if (isPastDate(date)) return null;

    const handleSubmit = ({ important, ...rest }) =>
      createTask({
        ...rest,
        isImportant: important,
        dueDate: date,
        index: tasks.length,
      });

    return (
      <Disclosure buttonText="New Task" className={styles.disclosure}>
        <TaskForm onSubmit={handleSubmit} />
      </Disclosure>
    );
  };
  const handleSortClick = () => {
    sortTasksInDay(date);
  };

  return (
    <li ref={ref} className={styles.root}>
      <DayColumnHeader
        date={date}
        difficulty={getTotalDifficulty(tasks)}
        onSortClick={handleSortClick}
      />
      <Tasks isInPast={isInPast} isBlocked={blocked} tasks={tasks} />
      {renderTaskForm()}
    </li>
  );
});
DayColumn.displayName = "DayColumn";

const DroppableDayColumn = ({ date, tasks }) => {
  const { moveTask } = useContext(PersistenceContext);
  const isInPast = isPastDate(date);

  const [{ isOver }, drop] = useDrop({
    accept: DND_IDS.TASK,
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
    hover: (item) => {
      if (isSameDay(item.dueDate, date)) return;

      moveTask(item.id, date);
      item.dueDate = date;
    },
  });

  return (
    <DayColumn
      date={date}
      tasks={tasks}
      ref={drop}
      blocked={isOver && isInPast}
    />
  );
};

export default DroppableDayColumn;
