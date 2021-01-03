import React, { useEffect, useRef, useContext } from "react";
import { Formik, Form, Field } from "formik";
import * as R from "ramda";
import { titleCase } from "title-case";
import styles from "./styles.module.css";
import { TextInput, PrimaryButton, Slider, Switch } from "../Atoms";
import { mapIndexed, PersistenceContext } from "../../shared";

const sliderMarkersFromDifficulties = mapIndexed(({ name }, i) => ({
  value: i,
  label: titleCase(name),
}));

const TaskForm = ({ onSubmit }) => {
  const difficulties = useContext(PersistenceContext).getDifficulties();
  const textRef = useRef();
  useEffect(() => {
    textRef.current.focus();
  }, []);

  const handleSubmit = (values, { resetForm }) => {
    onSubmit(R.assoc("difficulty", difficulties[values.difficulty].id, values));
    resetForm();
    textRef.current.focus();
  };

  return (
    <Formik
      initialValues={{
        text: "",
        difficulty: 0,
        important: false,
      }}
      onSubmit={handleSubmit}
    >
      <Form className={styles.root}>
        <TextInput innerRef={textRef} label="Text" name="text" required />

        <Slider
          markers={sliderMarkersFromDifficulties(difficulties)}
          name="difficulty"
          label="Difficulty"
          min={0}
          max={2}
          step={1}
        />

        <Field
          as={Switch}
          label="Important?"
          name="important"
          type="checkbox"
        />

        <PrimaryButton type="submit" fullWidth>
          Create Task
        </PrimaryButton>
      </Form>
    </Formik>
  );
};

export default TaskForm;
