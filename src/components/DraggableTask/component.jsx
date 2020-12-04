import React, { useRef } from "react";
import cn from "classnames";
import styles from "./styles.module.css";
import { useDrag, useDrop } from "react-dnd";
import { isEqual } from "date-fns";
import Task from "../Task";
import { DND_IDS } from "../../shared/constants";

const DraggableTask = ({ task, index, onTaskMove, onDragStart, onDragEnd }) => {
  const ref = useRef(null);
  const [{ draggedItem }, drag] = useDrag({
    item: {
      type: DND_IDS.TASK,
      index,
      id: task.id,
      dueDate: task.dueDate,
    },
    begin: onDragStart,
    end: onDragEnd,
    collect: (monitor) => ({
      draggedItem: monitor.getItem() || { id: null },
    }),
  });
  const isDragging = draggedItem.id === task.id;

  const [, drop] = useDrop({
    accept: DND_IDS.TASK,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover: (item, monitor) => {
      if (!ref.current) return false;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex && isEqual(task.dueDate, item.dueDate))
        return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      onTaskMove({
        id: item.id,
        newIndex: index,
        newDueDate: task.dueDate,
      });
      item.index = index;
      item.dueDate = task.dueDate;
    },
  });

  if (!task.isComplete) {
    drag(drop(ref));
  }

  return (
    <li className={cn({ [styles.dragging]: isDragging })} ref={ref}>
      <Task key={task.id} task={task} />
    </li>
  );
};

export default DraggableTask;
