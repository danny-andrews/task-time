import React from "react";
import cn from "classnames";
import { useDrag } from "react-dnd";
import Task from "../Task";
import styles from "./.module.css";
import { DND_IDS } from "../../shared/constants";

const DraggableTask = ({ task }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { id: task.id, type: DND_IDS.TASK },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const liClasses = cn({ [styles["dragging"]]: isDragging });
  const dragRef = task.isComplete ? null : drag;

  return (
    <li className={liClasses} ref={dragRef}>
      <Task key={task.id} task={task} />
    </li>
  );
};

const Tasks = ({ tasks }) => {
  return (
    <ol className={styles.root}>
      {tasks.map((task) => (
        <DraggableTask key={task.id} task={task} />
      ))}
    </ol>
  );
};

export default Tasks;
