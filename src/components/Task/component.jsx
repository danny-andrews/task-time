import React, { useEffect } from "react";
import { DND_IDS } from "../../shared/constants";
import cn from "classnames";
import { useDrag } from "react-dnd";
import styles from "./.module.css";
import { Button, ButtonGroup } from "../Atoms";
import { Refresh } from "../Icons";
import { getTaskStaleness } from "../../shared/model";

const Task = ({ task, onTaskClick, onRefreshClick }) => {
  const { id, text, isImportant, difficulty } = task;

  // Handlers
  const handleTaskClick = () => {
    onTaskClick(id);
  };

  const handleRefreshClick = () => {
    onRefreshClick(id);
  };

  // DnD
  const [{ isDragging }, drag] = useDrag({
    item: { id, type: DND_IDS.TASK },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Template Vars
  const classes = cn(
    styles.root,
    styles[`difficulty-${difficulty.name.toLowerCase()}`],
    {
      [styles["is-dragging"]]: isDragging,
      [styles["is-important"]]: isImportant,
    }
  );
  const staleness = getTaskStaleness(task);
  const renderStaleness = () => {
    if (staleness <= 0) return null;

    return (
      <Button onClick={handleRefreshClick} className={styles.staleness}>
        <div className={styles["staleness-text"]}>{staleness}d</div>
        <Refresh className={styles.refresh} />
      </Button>
    );
  };

  return (
    <ButtonGroup as="li" className={classes} ref={drag}>
      {renderStaleness()}
      <Button className={styles.text} onClick={handleTaskClick}>
        {text}
      </Button>
      <Button className={styles.edit}>edit</Button>
    </ButtonGroup>
  );
};

export default Task;
