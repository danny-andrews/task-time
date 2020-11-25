import React from "react";
import cn from "classnames";
import styles from "./styles.module.css";
import { PrimaryButton, IconButton, ButtonGroup } from "../Atoms";
import { Refresh, Edit, Trash } from "../Icons";
import { isPastDate } from "../../shared/dates";

// Base height of component (to be used as rem value).
const BASE_HEIGHT = 2.5;

// Base task component. This isn't meant to be used directly, hence why it is
// not exported. A task can be in one of three states: Incomplete, Complete, and
// Locked. These are codified in variation components defined below.
const Task = ({
  // Render control
  isDisabled = false,
  disableRefresh = false,
  secondaryAction,
  className,

  // Task values
  text,
  difficulty,
  staleness,
  isImportant,
  isComplete,

  // Events
  onTaskClick,
  onRefreshClick,
}) => {
  const classes = cn(styles.root, className, {
    [styles["complete"]]: isComplete,
    [styles["important"]]: isImportant,
  });
  const textClasses = cn(styles.text, {
    [styles["strike-through"]]: isComplete,
  });
  const height = difficulty * BASE_HEIGHT + (difficulty - 1);

  // I'm normally against inline styles, but I'm making an exception here
  // because the css value really is completely dynamic.
  const style = {
    height: `${height}rem`,
  };

  const renderStaleness = () => {
    if (staleness <= 0) return null;

    return (
      <IconButton
        className={styles.staleness}
        onClick={onRefreshClick}
        isDisabled={disableRefresh}
      >
        <div className={styles["staleness-text"]}>{staleness}d</div>
        <Refresh
          aria-label="Refresh staleness"
          className={styles["refresh-icon"]}
        />
      </IconButton>
    );
  };

  return (
    <ButtonGroup style={style} className={classes} isDisabled={isDisabled}>
      {renderStaleness()}
      <PrimaryButton
        aria-label="Complete Task"
        className={textClasses}
        onClick={onTaskClick}
      >
        {text}
      </PrimaryButton>
      {secondaryAction}
    </ButtonGroup>
  );
};

export const LockedTask = (props) => (
  <Task isDisabled disableRefresh secondaryAction={null} {...props} />
);

export const CompletedActiveTask = ({ onDeleteClick, ...rest }) => (
  <Task
    disableRefresh
    secondaryAction={
      <IconButton
        className={styles.edit}
        onClick={onDeleteClick}
        aria-label="Delete task"
      >
        <Trash className={styles["trash-icon"]} />
      </IconButton>
    }
    onSecondaryActionClick={onDeleteClick}
    {...rest}
  />
);

export const IncompleteTask = ({ onEditClick, ...rest }) => (
  <Task
    onSecondaryActionClick={onEditClick}
    secondaryAction={
      <IconButton
        className={styles.edit}
        onClick={onEditClick}
        aria-label="Edit task"
      >
        <Edit className={styles["edit-icon"]} />
      </IconButton>
    }
    {...rest}
  />
);

// Factory for getting the proper task variation component for given task data.
export default (dueDate, isComplete) =>
  isPastDate(dueDate)
    ? LockedTask
    : isComplete
    ? CompletedActiveTask
    : IncompleteTask;
