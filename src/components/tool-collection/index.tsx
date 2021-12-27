import React from "react";
import zoomIn from "../../img/zoom-in.png";
import remove from "../../img/remove.png";
import rotate from "../../img/rotate.png";
import zoomOut from "../../img/zoom-out.png";
import styles from "./style.module.css";

export interface ToolCollectionProps {
  onRotate?: () => void;
  onRemove?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

export const ToolCollection: React.FC<ToolCollectionProps> = ({ onRotate, onRemove, onZoomIn, onZoomOut }) => {
  return (
    <div>
      <span>Tool Collection</span>
      <table width="250px">
        <tbody>
          <tr>
            <td>
              <Tooltip hotkey="R">
                <img className={styles.tool} src={rotate} onClick={onRotate} />
              </Tooltip>
            </td>
            <td>
              <Tooltip hotkey="Del">
                <img className={styles.tool} src={remove} onClick={onRemove} />
              </Tooltip>
            </td>
          </tr>
          <tr>
            <td>
              <Tooltip hotkey="=">
                <img className={styles.tool} src={zoomIn} onClick={onZoomIn} />
              </Tooltip>
            </td>
            <td>
              <Tooltip hotkey="-">
                <img className={styles.tool} src={zoomOut} onClick={onZoomOut} />
              </Tooltip>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const Tooltip: React.FC<{ hotkey: React.ReactNode }> = ({ children, hotkey }) => {
  return (
    <div className={styles["tooltip-host"]}>
      <div className={styles.tooltip}>
        <kbd>{hotkey}</kbd>
      </div>
      {children}
    </div>
  );
};
