import React from "react";
import pause from "../../img/pause.png";
import resume from "../../img/resume.png";
import { Mode } from "../../core/controller/schema";
import arrow from "../../img/arrow.png";
import styles from "./style.module.css";

export interface ControlsProps {
  mode: Mode;
  paused: boolean;
  setPaused?: React.Dispatch<React.SetStateAction<boolean>>;
  handleLayoutMode?: () => void;
  handlePlayMode?: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  mode,
  paused,
  handleLayoutMode,
  handlePlayMode,
  setPaused
}) => {
  
  const isPlaying = mode === Mode.Play;
  return (
    <div className={styles["mode-zone"]}>
      <span>Controls</span>
      <table width="250px">
        <tbody>
          <tr>
            <td className={styles["mode-col"]} align="right">
              {mode === Mode.Layout && <img src={arrow} height="20" />}
            </td>
            <td align="left" colSpan={2}>
              <button className={styles.button} onClick={handleLayoutMode}>
                Layout Mode
              </button>
            </td>
          </tr>
          <tr>
            <td className={styles["mode-col"]} align="right">
              {isPlaying && <img src={arrow} height="20" />}
            </td>
            <td align="left">
              <button className={styles.button} onClick={handlePlayMode}>
                Play Mode
              </button>
            </td>
            <td>
              {isPlaying && (
                <img
                  className={styles["controll-img"]}
                  height="30"
                  src={paused ? resume : pause}
                  onClick={() => {
                    setPaused?.((p) => !p);
                  }}
                />
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <span className={styles.span}>GIZMO BALL</span>
    </div>
  );
};
