import React, { useState, useContext } from "react";
import cn from "classnames";
import DraggableTask from "../DraggableTask";
import styles from "./styles.module.css";
import { PersistenceContext } from "../../shared";

const Tasks = ({ isBlocked, isInPast, tasks, tasksRef }) => {
  const { changeTaskPosition } = useContext(PersistenceContext);

  // HACK: Remove hover styles for draggable items while dragging is in progress
  // in order to get around a browser bug.
  // See https://bugs.chromium.org/p/chromium/issues/detail?id=410328#c5 for
  // more info.
  const [dragInProgress, setDragInProgress] = useState(false);

  return (
    <div
      className={cn(styles.root, {
        [styles["ax-hover-styles"]]: dragInProgress,
        [styles["blocked"]]: isBlocked,
        [styles["in-past"]]: isInPast,
      })}
    >
      <ol className={styles.inner} ref={tasksRef}>
        {tasks.map((task, i) => (
          <DraggableTask
            key={task.id}
            task={task}
            index={i}
            onTaskMove={changeTaskPosition}
            onDragStart={() => setDragInProgress(true)}
            onDragEnd={() => setDragInProgress(false)}
          />
        ))}
      </ol>
    </div>
  );
};

export default Tasks;
