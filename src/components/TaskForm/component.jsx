import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useContext,
} from "react";
import { Formik, Form } from "formik";
import * as R from "ramda";
import { titleCase } from "title-case";
import styles from "./styles.module.css";
import { TextInput, PrimaryButton, Slider, Switch } from "../Atoms";
import { mapIndexed } from "../../shared/util";
import { PersistenceContext } from "../../shared/contexts";

const sliderMarkersFromDifficulties = mapIndexed(({ name }, i) => ({
  value: i,
  label: titleCase(name),
}));

const TaskForm = ({ onSubmit }, ref) => {
  const difficulties = useContext(PersistenceContext).getDifficulties();

  // HACK: We must call `focus` imperatively because the only way to bring up
  // the virtual keyboard on mobile devices is to focus an element within a
  // click handler, initiated by a user action (not simulated via JavaScript).
  // For more information: https://stackoverflow.com/a/15133808/2433572.
  useImperativeHandle(ref, () => ({
    focus: () => {
      textRef.current.focus();
    },
  }));

  // Handlers
  const handleSubmit = (values, { resetForm }) => {
    onSubmit(R.assoc("difficulty", difficulties[values.difficulty].id, values));
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
  const sliderMarkers = sliderMarkersFromDifficulties(difficulties);

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form className={styles.form}>
        <TextInput innerRef={textRef} label="Text" name="text" required />

        <Slider
          markers={sliderMarkers}
          name="difficulty"
          label="Difficulty"
          min={0}
          max={2}
          step={1}
        />

        <Switch label="Important?" name="important" />

        <PrimaryButton type="submit">Create Task</PrimaryButton>
      </Form>
    </Formik>
  );
};

export default forwardRef(TaskForm);
