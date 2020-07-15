import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import cn from "classnames";
import styles from "./.module.css";
import { Input, Button } from "../Atoms";
import utilStyles from "../Atoms/index.module.css";
import { head } from "ramda";
import { titleCase } from "../../shared/util";

const difficulties = [
  {
    id: "EASY",
    name: "easy",
  },
  {
    id: "MEDIUM",
    name: "medium",
  },
  {
    id: "HARD",
    name: "hard",
  },
];

const TaskForm = ({ onSubmit, className }) => {
  const classes = cn(styles.form, className, utilStyles["inner-spacing-small"]);
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Formik
      initialValues={{
        text: "",
        difficulty: head(difficulties).id,
        important: false,
      }}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        resetForm();
      }}
    >
      <Form className={classes}>
        <Input
          innerRef={inputRef}
          label="Text"
          name="text"
          type="text"
          required
        />

        <div id="difficulty-group">Difficulty</div>
        <div
          className={styles["input-group"]}
          role="group"
          aria-labelledby="difficulty-group"
        >
          {difficulties.map(({ id, name }) => (
            <Input
              key={id}
              label={titleCase(name)}
              name="difficulty"
              type="radio"
              value={id}
            />
          ))}
        </div>

        <Input label="Important?" name="important" type="checkbox" />

        <Button type="submit">Create Task</Button>
      </Form>
    </Formik>
  );
};

export default TaskForm;
