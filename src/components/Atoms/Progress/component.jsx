import React, { useRef, useEffect } from "react";
import cn from "classnames";
import styles from "./styles.module.css";

const Progress = ({ className, max, current, label }) => {
  const ref = useRef();
  useEffect(() => {
    ref.current.style.setProperty(
      "--progress-bar-offset",
      `${(1 - Math.min(current, max) / max) * -100}%`
    );
    if (current > max) {
      ref.current.style.setProperty(
        "--progress-bar-max-marker-offset",
        `${(max / current) * 100}%`
      );
    } else {
      ref.current.style.setProperty(
        "--progress-bar-max-marker-offset",
        "-100%"
      );
    }
  }, [current, max]);

  return (
    <div ref={ref} className={cn(styles.root, className)}>
      <div className={styles["bar-and-label"]}>
        <p className={styles.label}>{label}</p>
        <div
          className={styles["bar-container"]}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <div className={styles.bar} />
        </div>
      </div>
      <p className={styles.label}>{[current, max].join("/")}</p>
    </div>
  );
};

export default Progress;
