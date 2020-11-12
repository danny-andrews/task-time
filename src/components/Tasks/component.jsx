import React, { useRef, useState, useEffect } from "react";
import cn from "classnames";
import { useDrag, useDrop } from "react-dnd";
import { move } from "ramda";
import Task from "../Task";
import styles from "./styles.module.css";
import { DND_IDS } from "../../shared/constants";
import { useBackend } from "../../hooks";

const DraggableTask = ({
  task,
  index,
  onTaskHovered,
  onDragStart,
  onDragEnd,
  onTaskDropped,
}) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    item: {
      id: task.id,
      type: DND_IDS.TASK,
      index,
      dueDate: task.dueDate,
    },
    begin: () => {
      onDragStart();
    },
    end: () => {
      onDragEnd();
    },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });

  const [, drop] = useDrop({
    accept: DND_IDS.TASK,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover: (item, monitor) => {
      if (monitor.canDrop()) {
        onTaskHovered(item.id, item.index, index);
        item.index = index;
      }
    },
    canDrop: (item) => {
      if (!ref.current) return false;
      const oldIndex = item.index;
      const newIndex = index;

      // Don't replace items with themselves
      if (oldIndex === newIndex) return false;

      return true;
    },
    drop: (item) => {
      onTaskDropped(item.id, item.index, index);
    },
  });
  if (!task.isComplete) {
    drag(drop(ref));
  }

  const liClasses = cn({
    [styles.dragging]: isDragging,
  });

  return (
    <li className={liClasses} ref={ref}>
      <Task key={task.id} task={task} />
    </li>
  );
};

const Tasks = ({ tasks }) => {
  const { changeTaskPosition } = useBackend();
  const [tasksProxy, setTasksProxy] = useState(tasks);
  useEffect(() => {
    setTasksProxy(tasks);
  }, [tasks]);

  const handleTaskHovered = (taskId, oldIndex, newIndex) => {
    setTasksProxy(move(oldIndex, newIndex));
  };
  const [dragInProgress, setDragInProgress] = useState(false);
  // HACK: Remove hover styles for draggable items while dragging is in progress
  // in order to get around a browser bug.
  // See https://bugs.chromium.org/p/chromium/issues/detail?id=410328#c5 for
  // more info.
  const classes = cn(styles.root, {
    [styles["ax-hover-styles"]]: dragInProgress,
  });

  return (
    <ol className={classes}>
      {tasksProxy.map((task, i) => (
        <DraggableTask
          key={task.id}
          task={task}
          index={i}
          onTaskDropped={changeTaskPosition}
          onTaskHovered={handleTaskHovered}
          onDragStart={() => setDragInProgress(true)}
          onDragEnd={() => setDragInProgress(false)}
        />
      ))}
    </ol>
  );
};

export default Tasks;
