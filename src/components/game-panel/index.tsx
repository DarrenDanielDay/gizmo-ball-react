import React from "react";
import styles from "./style.module.css";

export const GamePanel: React.FC = () => {
  return (
    <div className={styles["game-panel"]}>
      <div className={styles["game-grid"]}></div>
    </div>
  );
};
