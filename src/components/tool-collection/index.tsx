import React from "react";
import zoomIn from "../../img/zoom-in.png";
import remove from "../../img/remove.png";
import rotate from "../../img/rotate.png";
import zoomOut from "../../img/zoom-out.png";
import styles from "./style.module.css";
import { Tooltip } from "../tooltip";

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
              <Tooltip tooltip={<kbd>R</kbd>}>
                <img className={styles.tool} src={rotate} onClick={onRotate} />
              </Tooltip>
            </td>
            <td>
              <Tooltip tooltip={<kbd>Del</kbd>}>
                <img className={styles.tool} src={remove} onClick={onRemove} />
              </Tooltip>
            </td>
          </tr>
          <tr>
            <td>
              <Tooltip tooltip={<kbd>=</kbd>}>
                <img className={styles.tool} src={zoomIn} onClick={onZoomIn} />
              </Tooltip>
            </td>
            <td>
              <Tooltip tooltip={<kbd>-</kbd>}>
                <img className={styles.tool} src={zoomOut} onClick={onZoomOut} />
              </Tooltip>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
