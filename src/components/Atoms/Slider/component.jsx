import React from "react";
import {
  SliderInput,
  SliderTrack,
  SliderTrackHighlight,
  SliderMarker,
  SliderHandle,
} from "@reach/slider";
import { useField } from "formik";
import "@reach/slider/styles.css";
import styles from "./styles.module.css";
import { uniqueId } from "../../../shared";

const Slider = ({ markers, label, className, ...props }) => {
  const [{ value }, , { setValue }] = useField(props.name);
  const labelId = uniqueId(`${props.name}-`);

  return (
    <div className={className}>
      <p className={styles.label} id={labelId}>
        {label}
      </p>
      <div className={styles.container}>
        <SliderInput
          value={value}
          onChange={setValue}
          className={styles.input}
          aria-labelledby={labelId}
          {...props}
        >
          <SliderTrack className={styles["slider-track"]}>
            <SliderTrackHighlight className={styles.highlight} />
            {markers.map(({ value, label }) => (
              <SliderMarker key={value} className={styles.marker} value={value}>
                <div className={styles["marker-label"]}>{label}</div>
              </SliderMarker>
            ))}
            <SliderHandle className={styles.handle} />
          </SliderTrack>
        </SliderInput>
      </div>
    </div>
  );
};

export default Slider;
