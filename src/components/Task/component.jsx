import React, { useRef, useEffect } from "react";
import cn from "classnames";
import { Formik, Form } from "formik";
import styles from "./styles.module.css";
import { PrimaryButton, IconButton, ButtonGroup, TextInput } from "../Atoms";
import { Refresh, Edit, Trash, Save } from "../Icons";

// Base height of component (to be used as rem value).
const BASE_HEIGHT = 2.5;

// Base task component. This isn't meant to be used directly, hence it is not
// exported. A task can be in one of three states: Incomplete, Complete, and
// Locked. These are codified in variation components defined below.
const Task = ({
  // Task values
  text,
  difficulty,
  staleness,
  isImportant,
  isComplete,

  // Events
  onTaskClick,
  onRefreshClick,

  // Render control
  isDisabled = false,
  disableRefresh = false,
  primaryAction = (
    <PrimaryButton
      aria-label="Complete Task"
      className={cn(styles.primary, { [styles["strike-through"]]: isComplete })}
      onClick={onTaskClick}
    >
      {text}
    </PrimaryButton>
  ),
  secondaryAction,
  className,
}) => {
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
    <ButtonGroup
      style={{
        height: `${difficulty * BASE_HEIGHT + (difficulty - 1)}rem`,
      }}
      className={cn(styles.root, className, {
        [styles["complete"]]: isComplete,
        [styles["important"]]: isImportant,
      })}
      isDisabled={isDisabled}
    >
      {renderStaleness()}
      {primaryAction}
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
        className={styles.secondary}
        onClick={onDeleteClick}
        aria-label="Delete task"
      >
        <Trash className={styles["trash-icon"]} />
      </IconButton>
    }
    {...rest}
  />
);

export const IncompleteTask = ({ onEditClick, ...rest }) => (
  <Task
    secondaryAction={
      <IconButton
        className={styles.secondary}
        onClick={onEditClick}
        aria-label="Edit task"
      >
        <Edit className={styles["edit-icon"]} />
      </IconButton>
    }
    {...rest}
  />
);

export const EditingTask = ({ onSave, ...rest }) => {
  const textRef = useRef();
  useEffect(() => {
    textRef.current.focus();
  }, []);

  return (
    <Formik initialValues={{ text: rest.text }} onSubmit={onSave}>
      <Form>
        <Task
          primaryAction={
            <TextInput
              className={cn(styles.primary, styles.form)}
              innerRef={textRef}
              name="text"
            />
          }
          secondaryAction={
            <IconButton
              className={styles.secondary}
              aria-label="Save task"
              type="submit"
            >
              <Save className={styles["save-icon"]} />
            </IconButton>
          }
          {...rest}
        />
      </Form>
    </Formik>
  );
};
