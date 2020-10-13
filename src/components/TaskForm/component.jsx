import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Formik, Form } from "formik";
import cn from "classnames";
import { assoc } from "ramda";
import styles from "./styles.module.css";
import { TextInput, Checkbox, PrimaryButton, Slider } from "../Atoms";
import { titleCase, mapIndexed } from "../../shared/util";
import { useBackend } from "../../hooks";

const sliderMarkersFromDifficulties = mapIndexed(({ name }, i) => ({
  value: i,
  label: titleCase(name),
}));

const TaskForm = ({ onSubmit, className }, ref) => {
  const { data: difficulties = [] } = useBackend().useDifficulties();

  useImperativeHandle(ref, () => ({
    focus: () => {
      textRef.current.focus();
    },
  }));

  // Handlers
  const handleSubmit = (values, { resetForm }) => {
    onSubmit(assoc("difficulty", difficulties[values.difficulty].id, values));
    resetForm();
    textRef.current.focus();
  };

  // Template Vars
  const textRef = useRef();
  const initialValues = {
    text: "",
    difficulty: 0,
    important: false,
  };
  const classes = cn(styles.form, className);
  const sliderMarkers = sliderMarkersFromDifficulties(difficulties);

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form className={classes}>
        <TextInput innerRef={textRef} label="Text" name="text" required />

        <Slider
          markers={sliderMarkers}
          name="difficulty"
          label="Difficulty"
          min={0}
          max={2}
          step={1}
        />

        <Checkbox label="Important?" name="important" />

        <PrimaryButton type="submit">Create Task</PrimaryButton>
      </Form>
    </Formik>
  );
};

export default forwardRef(TaskForm);
