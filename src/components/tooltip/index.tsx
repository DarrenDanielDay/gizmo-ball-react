import React from "react";
import styles from "./style.module.css";


export const Tooltip: React.FC<{ tooltip: React.ReactNode; }> = ({ children, tooltip }) => {
  return (
    <div className={styles["tooltip-host"]}>
      <div className={styles.tooltip}>
        <div className={styles["tooltip-content"]}>
          {tooltip}
        </div>
      </div>
      {children}
    </div>
  );
};
