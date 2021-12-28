import React from "react";
import pause from "../../img/pause.png";
import resume from "../../img/resume.png";
import { Mode } from "../../core/controller/schema";
import arrow from "../../img/arrow.png";
import styles from "./style.module.css";
import classNames from "classnames";

export interface ControlsProps {
  mode: Mode;
  domMode: boolean;
  paused: boolean;
  toggleDomMode?: React.DispatchWithoutAction;
  togglePaused?: React.DispatchWithoutAction;
  handleLayoutMode?: () => void;
  handlePlayMode?: () => void;
  handleSave?: () => void;
  handleLoad?: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  mode,
  domMode,
  paused,
  toggleDomMode,
  togglePaused,
  handleLayoutMode,
  handlePlayMode,
  handleSave,
  handleLoad,
}) => {
  const isPlaying = mode === Mode.Play;
  return (
    <div className={styles["mode-zone"]}>
      <span>Controls</span>
      <div>
        <div className={styles["control-row"]}>
          <img src={arrow} className={isPlaying ? styles.hide : styles.show} height="20" />
          <button className={styles.button} onClick={handleLayoutMode}>
            Layout Mode
          </button>
          <div></div>
        </div>
        <div className={styles["control-row"]}>
          <img src={arrow} className={isPlaying ? styles.show : styles.hide} height="20" />
          <button className={styles.button} onClick={handlePlayMode}>
            Play Mode
          </button>
          <img
            className={classNames(styles["controll-img"], isPlaying ? styles.show : styles.hide)}
            height="30"
            src={paused ? resume : pause}
            onClick={togglePaused}
          />
        </div>
        <div className={styles["control-row"]}>
          <div></div>
          <button className={styles.button} onClick={handleSave}>
            Save
          </button>
          <div></div>
        </div>
        <div className={styles["control-row"]}>
          <div></div>
          <button className={styles.button} onClick={handleLoad}>
            Load
          </button>
          <div></div>
        </div>
      </div>
      {<span onClick={toggleDomMode} className={styles.span}>{domMode ? "DOM BOOST" : "GIZMO BALL"}</span>}
    </div>
  );
};
