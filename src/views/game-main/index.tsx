import React from "react";
import classNames from "classnames";
import styles from "./style.module.css";
import { GamePanel } from "../../components/game-panel";
import { ItemCollection } from "../../components/item-collection";
import { ToolCollection } from "../../components/tool-collection";
import { Controls } from "../../components/controls";

export const GameMainView: React.FC = () => {
  return (
    <div className={styles["game"]}>
      <div className={styles.border}>
        <GamePanel />
      </div>
      <div className={classNames(styles["right-side"], styles.border)}>
        <div className={classNames(styles["right-top"], styles.border)}>
          <ItemCollection />
        </div>
        <div className={classNames(styles["right-middle"], styles.border)}>
          <ToolCollection />
        </div>
        <div className={classNames(styles["right-bottom"], styles.border)}>
          <Controls />
        </div>
      </div>
      <div className={styles.instruction}></div>
    </div>
  );
};
