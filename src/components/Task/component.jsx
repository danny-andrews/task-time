import React from "react";
import { DND_IDS } from "../../shared/constants";
import cn from "classnames";
import { useDrag } from "react-dnd";
import { parseISO, differenceInDays } from "date-fns";
import styles from "./.module.css";
import { Button, ButtonGroup } from "../Atoms";
import { Refresh } from "../Icons";

const calculateStaleness = (createdAt, originalDueDate) =>
  differenceInDays(new Date(), parseISO(createdAt)) -
  differenceInDays(parseISO(originalDueDate), parseISO(createdAt));

const Task = ({ task, onTaskClick, onRefreshClick }) => {
  const {
    id,
    text,
    isImportant,
    difficulty,
    originalDueDate,
    createdAt,
  } = task;

  const [{ isDragging }, drag] = useDrag({
    item: { id, type: DND_IDS.TASK },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const className = cn(
    styles.root,
    styles[`difficulty-${difficulty.name.toLowerCase()}`],
    {
      [styles["is-dragging"]]: isDragging,
      [styles["is-important"]]: isImportant,
    }
  );

  const handleTaskClick = () => {
    onTaskClick(id);
  };

  const handleRefreshClick = () => {
    onRefreshClick(id);
  };

  const staleness = calculateStaleness(createdAt, originalDueDate);
  const renderStaleness = () => {
    if (staleness <= 0) return null;

    return (
      <Button
        onClick={handleRefreshClick}
        className={styles["staleness-button"]}
      >
        <div className={styles["staleness-text"]}>{staleness}d</div>
        <Refresh className={styles.refresh} />
      </Button>
    );
  };

  return (
    <li className={className} ref={drag}>
      <ButtonGroup className={styles["button-group"]}>
        {renderStaleness()}
        <Button className={styles.text} onClick={handleTaskClick}>
          {text}
        </Button>
        <Button className={styles.edit}>edit</Button>
      </ButtonGroup>
    </li>
  );
};

export default Task;
