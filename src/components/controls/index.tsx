import React, { useState } from "react";
import pause from "../../img/pause.png";
import resume from "../../img/resume.png";
import { Mode } from "../../core/controller/schema";
import arrow from "../../img/arrow.png";
import styles from "./style.module.css";

export const Controls: React.FC = () => {
  const [mode, setMode] = useState(Mode.Layout);
  const [paused, setPaused] = useState(false);
  const handleLayoutMode = () => {
    setMode(Mode.Layout);
    setPaused(false);
  };
  const handlePlayMode = () => {
    setMode(Mode.Play);
  };
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
                    setPaused((p) => !p);
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
