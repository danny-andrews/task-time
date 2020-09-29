import React from "react";
import cn from "classnames";
import styles from "./.module.css";
import { Button, ButtonGroup } from "../../Atoms";
import { Refresh } from "../../Icons";
import { isPastDate } from "../../../shared/dates";

const Task = ({
  isDisabled = false,
  disableRefresh = false,
  disableEdit = false,
  text,
  isImportant,
  difficultyName,
  staleness,
  onTaskClick,
  onRefreshClick,
  isComplete,
}) => {
  // Template Vars
  const classes = cn(
    styles.root,
    styles[`difficulty-${difficultyName.toLowerCase()}`],
    {
      [styles["complete"]]: isComplete,
      [styles["important"]]: isImportant,
    }
  );
  const textClasses = cn(styles.text, { [styles["complete"]]: isComplete });

  const renderStaleness = () => {
    if (staleness <= 0) return null;

    return (
      <Button
        isDisabled={disableRefresh}
        onClick={onRefreshClick}
        className={styles.staleness}
      >
        <div className={styles["staleness-text"]}>{staleness}d</div>
        <Refresh className={styles.refresh} />
      </Button>
    );
  };

  return (
    <ButtonGroup className={classes} isDisabled={isDisabled}>
      {renderStaleness()}
      <Button className={textClasses} onClick={onTaskClick}>
        {text}
      </Button>
      <Button isDisabled={disableEdit} className={styles.edit}>
        edit
      </Button>
    </ButtonGroup>
  );
};

export const LockedTask = (props) => (
  <Task isDisabled disableRefresh disableEdit {...props} />
);

export const CompletedTask = (props) => (
  <Task disableRefresh disableEdit {...props} />
);

export const IncompleteTask = (props) => <Task {...props} />;

export default (dueDate, isComplete) =>
  isPastDate(dueDate)
    ? LockedTask
    : isComplete
    ? CompletedTask
    : IncompleteTask;
